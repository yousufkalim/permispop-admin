import React, { Component } from "react";
import PackageList from "../../src/components/Packages/PackageList";
import AddUpdatePackage from "../../src/components/Packages/AddUpdatePackage";
import Button from "components/CustomButton/CustomButton.jsx";
import MembershipSetting from "../../src/components/Packages/MembershipSetting";
import $ from "jquery";

class Packages extends Component {
    state = {
        addUpdate: false,
        showSettings:false

    }
    toggle = e => {
        this.setState({ addUpdate: !this.state.addUpdate });
    }
    toggleSetting = e => {
        this.setState({ showSettings: !this.state.showSettings });
        if (this.state.showSettings)
            $("#setting-panel").slideDown("slow");
        else
            $("#setting-panel").slideUp("slow");
    }
    render() {
        if (this.state.addUpdate)
            return (
                <AddUpdatePackage toggle={this.toggle} />
            );
        else
            return (
                <div>
                    <div id="setting-panel">
                        <MembershipSetting />
                        </div>
                    <header className="pull-right" style={{ fontSize: 28 }}>
                        <Button bsStyle="info" fill type="button" onClick={this.toggle} >
                            <i class="fa fa-plus fa-2x"></i>
                        </Button>
                        <Button fill type="button"  >
                            <i class="fa fa-cog fa-2x" onClick={this.toggleSetting}></i>
                        </Button>
                        <div className="clearfix" />
                    </header>
                    <PackageList toggle={this.toggle} />
                </div>
            );

    }
}

export default Packages;
