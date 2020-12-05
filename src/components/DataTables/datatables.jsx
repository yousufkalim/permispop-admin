import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Translation } from "react-i18next";
import { Grid, Row, Col } from "react-bootstrap";
const $ = require("jquery");
$.DataTable = require("datatables.net");

export default class DataTableCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: this.props.columns,
      language: {
        // url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json",
      },
      columnDefs: [
        {
          targets: this.props.actionCol,
          createdCell: (td, cellData, rowData, row, col) =>
            ReactDOM.render(
              <React.Fragment>
                <i className="fa fa-pencil"></i>
                <i className="fa fa-trash"></i>
              </React.Fragment>,
              td
            ),
        },
      ],
    });
    this.setState({ loading: false });
  }

  componentWillMount() {
    // this.$el.DataTable.destroy(true);
    this.setState({ loading: true });
  }
  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <div className="table-responsive">
              <table
                className="display table table-hover table-bordered  custome-table-style"
                width="100%"
                ref={(el) => (this.el = el)}
              ></table>
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}
