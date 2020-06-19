import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
    Container,
    Grid,
    Fab,
    Button,
    ButtonGroup,
    Paper,
    Typography,
    Link,
    IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

function getAddButton(title, handler) {
    return (
        <Button onClick={handler} arial-label="add" color="primary">
            <AddIcon /> {`Add ${title}`}
        </Button>
    );
}
function getEditButton(handler) {
    return (
        <IconButton onClick={handler} arial-label="edit" component="span">
            <EditIcon />
        </IconButton>
    );
}
function getDeleteButton(handler) {
    return (
        <IconButton onClick={handler} arial-label="delete" component="span">
            <DeleteIcon />
        </IconButton>
    );
}

function appendActions(cmd, data, handlers) {
    const { handleEdit, handleDelete } = handlers;
    return data.map((element) => {
        let mod_set;
        switch (cmd) {
            case "update-delete":
                mod_set = [
                    getEditButton(() => handleEdit(element)),
                    getDeleteButton(() => handleDelete(element)),
                ];
                break;
            default:
                mod_set = [getEditButton(handleEdit)];
        }
        return Object.assign({}, element, { actions: mod_set });
    });
}

export default function MuiTable(props) {
    // cmd: cud, cu, c, cd
    const { classes, addLabel, data, cmd, handlers } = props;
    const { columns, rows, options } = data;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        columns.push({ name: "actions", label: "Actions" });
        setTableData(appendActions(cmd, rows, handlers));
    }, [data]);

    return (
        <MUIDataTable
            title={getAddButton(addLabel, handlers.handleAdd)}
            data={tableData}
            columns={columns}
            options={options}
        />
    );
}
