import { TableViewModel, TableDataPoint, DataCategory, DataMeasure } from "./models";

function GroupViewModel(viewModel: TableViewModel): TableDataPoint[] {
    viewModel.dataPointsOriginal.forEach(point => {
        point.categories.forEach(cat => {
            const col = viewModel.columns.find(col => col.index == cat.index)
            cat.isHidden = col && col.isHidden;
        })
        point.dataKey = point.categories
            .filter(cat => !cat.isHidden)
            .map(cat => cat.value).join('_');
    });

    const groups = viewModel.dataPointsOriginal.reduce((groups, item) => {
        const group = (groups[item.dataKey] || []);
        group.push(item);
        groups[item.dataKey] = group;
        return groups;
    }, {});

    //console.log("groups", groups, typeof (groups));

    let newDataPoints: TableDataPoint[] = [];

    Object.entries(groups).forEach(([key, value]) => {
        let cats: DataCategory[] = value[0].categories.filter(cat => {
            let col = viewModel.columns.find(col => col.index == cat.index);
            return col && !col.isHidden;
        });

        var vals: DataMeasure[] = [];
        let items = Array.prototype.slice.call(value);
        items.reduce((res, value) => {
            value.measures.forEach((mea: DataMeasure) => {
                if (!res[mea.index]) {
                    res[mea.index] = { index: mea.index, value: null, format: mea.format };
                    vals.push(res[mea.index]);
                }
                if (mea.value) {
                    if (res[mea.index].value == null) {
                        res[mea.index].value = 0;
                    }
                    res[mea.index].value += mea.value;
                }
            });

            return res;
        }, {});

        newDataPoints.push({
            dataKey: key,
            categories: cats,
            measures: vals
        });
    });

    //console.log("newDataPoints", newDataPoints);

    return newDataPoints;
}

export default GroupViewModel;