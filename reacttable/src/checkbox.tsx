import * as React from "react";

export class Checkbox extends React.Component<{ label: string, index: number, isHidden: boolean, classN: string, handleCheckboxChange }> {
    constructor(props) {
        super(props);
        this.state.isChecked = !props.isHidden;
    }
    public state = {
        isChecked: true,
    }

    toggleCheckboxChange = () => {
        const { handleCheckboxChange, index } = this.props;
        this.setState({ isChecked: !this.state.isChecked });
        handleCheckboxChange(index);
    }

    render() {
        const { index, label, isHidden, classN } = this.props;
        const { isChecked } = this.state;

        return (
            <div className="checkbox">
                <label className={classN}>
                    <input
                        type="checkbox"
                        value={index}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />
                    {label}
                </label>
            </div>
        );
    }
}
export default Checkbox;