import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

var sumM = function () {
    return function (opt) {
        let attr = "";
        if (opt) {
            attr = opt.props.vals[0]
        }
        return {
            sum: 0,
            val: "",
            push: function push(record) {
                if (!isNaN(parseFloat(record[attr]))) {
                    this.sum += parseFloat(record[attr]);
                } else {
                    if (record[attr]) {
                        let value = record[attr].toString().replace(/[^\-0-9.]/g, '');
                        if (!isNaN(parseFloat(value))) {
                            this.sum += value;
                        }
                    }
                }

                let pbFormat = record["Format"] || "#,##0.##;(#,##0.##)";

                let iValueFormatter: valueFormatter.IValueFormatter;
                iValueFormatter = valueFormatter.create({ cultureSelector: "en-US", format: pbFormat });
                let valueFormatted = iValueFormatter.format(this.sum);
                this.val = valueFormatted;
            },
            value: function () {
                return this.val;
            },
            format: function (x) {
                return x;
            },
            numInputs: typeof attr !== 'undefined' ? 0 : 1
        };
    };
}

var naturalSort = function naturalSort(as, bs) {
    // nulls first
    if (bs !== null && as === null) {
        return -1;
    }
    if (as !== null && bs === null) {
        return 1;
    }

    // then raw NaNs
    if (typeof as === 'number' && isNaN(as)) {
        return -1;
    }
    if (typeof bs === 'number' && isNaN(bs)) {
        return 1;
    }

    // numbers and numbery strings group together
    var nas = Number(as);
    var nbs = Number(bs);
    if (nas < nbs) {
        return -1;
    }
    if (nas > nbs) {
        return 1;
    }

    // within that, true numbers before numbery strings
    if (typeof as === 'number' && typeof bs !== 'number') {
        return -1;
    }
    if (typeof bs === 'number' && typeof as !== 'number') {
        return 1;
    }
    if (typeof as === 'number' && typeof bs === 'number') {
        return 0;
    }

    // 'Infinity' is a textual number, so less than 'A'
    if (isNaN(nbs) && !isNaN(nas)) {
        return -1;
    }
    if (isNaN(nas) && !isNaN(nbs)) {
        return 1;
    }

    // finally, "smart" string sorting per http://stackoverflow.com/a/4373421/112871
    var a = String(as);
    var b = String(bs);
    if (a === b) {
        return 0;
    }

    // special treatment for strings containing digits
    while (a.length && b.length) {
        var a1 = a;
        var b1 = b;
        if (a1 !== b1) {
            return a1 > b1 ? 1 : -1;
        }
    }
    return a.length - b.length;
};

var sortAs = function sortAs(order) {
    var mapping = {};

    // sort lowercased keys similarly
    var l_mapping = {};
    for (var i in order) {
        var x = order[i];
        mapping[x] = i;
        if (typeof x === 'string') {
            l_mapping[x.toLowerCase()] = i;
        }
    }
    return function (a, b) {
        if (a in mapping && b in mapping) {
            return mapping[a] - mapping[b];
        } else if (a in mapping) {
            return -1;
        } else if (b in mapping) {
            return 1;
        } else if (a in l_mapping && b in l_mapping) {
            return l_mapping[a] - l_mapping[b];
        } else if (a in l_mapping) {
            return -1;
        } else if (b in l_mapping) {
            return 1;
        }
        return naturalSort(a, b);
    };
};

export const SortAs = sortAs;
export const SumM = sumM;