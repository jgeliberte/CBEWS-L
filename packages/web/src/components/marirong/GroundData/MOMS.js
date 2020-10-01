import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Button, Typography
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useStyles, tableStyles } from '../../../styles/general_styles';

import Forms from '../../utils/Forms';
import FabMuiTable from "../../utils/MuiTable";

import moment from 'moment';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useCookies } from 'react-cookie';

import { MarCommunityRiskAssessment, MarGroundData } from '@dynaslope/commons';




function MomsInstances () {
    const cmd = "update-delete";
    const [cookies, setCookie] = useCookies(['credentials']);
    const dt_classes = tableStyles();
    const classes = useStyles();
      
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("add");

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Feature Type": "",
        "Description": ""
    });
    const [defaultTSValues, setDefaultTSValues] = useState({});
    const [defaultIntValues, setDefaultIntValues] = useState({});

    // TEST
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "feature_type", label: "Feature Type" },
        { name: "description", label: "Description" },
    ];
    
    useEffect(()=> {
        initTable();
    },[]);

    const initTable = async () => {
        const response = await MarGroundData.FetchMomsFeatures();
        response.status ? setTableData(response.data) : console.error("problem retrieving MOMS."); 
    }

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "Feature Type": "",
            "Description": ""
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        console.log(data);
        setDefaultStrValues({
            "Feature Type": data["feature_type"],
            "Remarks": data["remarks"],
        });
        setOpen(true);
        setCommand("edit");
    };

    const handleClose = () => {
      setOpen(false);
      resetState();
    };

    const handleDelete = (data) => {
        setSelectedData(data);
        handleOpenDelete();
    };

    const handleOpenDelete = () => {
        setOpen(false);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpen(true);
        setOpenDelete(false);
        resetState();
    }

    const deleteMoms = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = async () => {
        const input = {
            "moms_id": selectedData.moms_id
        };
        const response = await MarGroundData.DeleteMOMSData(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setNotifStatus("success");
        } else {
            setNotifStatus("error");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    const submit = async () => {
        console.log("formData.curren", formData.current);
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const { observance_ts, } = defaultTSValues;
            const temp_ts = {
                observance_ts: moment( ).format("YYYY-MM-DD HH:mm:ss"),
            }
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            
            Object.keys(json).forEach(key => {
                let temp;
                console.log("key", key);
                switch(key) {
                    case 'StatDesc':
                        json["stat_desc"] = json[key]
                        break;
                    case 'InCharge':
                        json["in_charge"] = json[key]
                        break;
                    case 'Resource':
                        json["resource"] = json[key]
                        break;
                    default:
                        json[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
            });
            response = await MarGroundData.InsertMomsFeatureType(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = []
            Object.keys(json).forEach(key => {
                let temp = {};
                console.log("key", key);
                switch(key) {
                    case 'StatDesc':
                        temp["stat_desc"] = json[key]
                        break;
                    case 'InCharge':
                        temp["in_charge"] = json[key]
                        break;
                    case 'Date':
                        temp["date"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarGroundData.UpdateMOMSData(temp_array);
        }

        if (response.status === true) {
            initTable();
            handleClose();
            setNotifStatus("success");
        } else {
            handleClose();
            setNotifStatus("error");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12} >
                    <FabMuiTable
                        classes={{}}
                        addLabel=""
                        data={{
                            columns: columns,
                            rows: tableData,
                        }}
                        handlers={{
                            handleAdd,
                            handleEdit,
                            handleDelete,
                        }}
                        options={options}
                        cmd={cmd}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        * click row to Raise/Modify/Remove MOMS data.
                    </Typography>
                </Grid>
                <Grid container align="center">
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => setOpen(true)}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </Container>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">MOMS</DialogTitle>
            <DialogContent>
                <Forms data={{
                        string: defaultStringValues,
                        int: defaultIntValues,
                        ts: defaultTSValues
                    }}
                    formData={formData}
                    closeForm={() => handleClose()}
                    submitForm={() => submit()}
                    deleteForm={() => deleteMoms()} 
                />
            </DialogContent>
        </Dialog>

        <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this entry?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Removing this MOMS data cannot be undone. Are you sure you want to remove this entry?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDelete} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
                    Confirmed
                </Button>
            </DialogActions>
        </Dialog>

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>
    </Fragment>
    )
}


///////////////////////////////////////////////////
// FUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK
///////////////////////////////////////////////////

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function MOMS() {
    const cmd = "update-delete";
    let feature_type_container = [];
    const [cookies, setCookie] = useCookies(['credentials']);
    const dt_classes = tableStyles();
    const classes = useStyles();
      
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("add");

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Remarks": "",
        "Feature Type": null,
        "Feature Name": null
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        "Observance TS": moment(),
    });
    const [defaultIntValues, setDefaultIntValues] = useState({
        "Alert Level": 0,
    });

    // TEST
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "observance_ts", label: "Observance TS" },
        { name: "remarks", label: "Remarks" },
        { name: "feature_type", label: "Feature Type" },
        { name: "feature_name", label: "Feature Name" },
        { name: "moms_reporter", label: "Moms Reporter" },
        { name: "op_trigger", label: "Alert Level" },
    ];
    
    useEffect(()=> {
        initTable();
    },[]);

    const initTable = async () => {
        const response = await MarGroundData.GetMOMSData();
        response.status ? setTableData(response.data) : console.error("problem retrieving MOMS."); 

        if (response.status) {
            const feature_types = await MarGroundData.FetchMomsFeatures();
            console.log("feature_types", feature_types)
            if (feature_types.status) {
                const temp = feature_types.data.map((element, index) => {
                    return ({
                        "type": element.feature_type,
                        "default_val": false
                    })
                });
                setDefaultStrValues({
                    ...defaultStringValues, 
                    "Feature Type": temp
                });
                console.log("defaultStringValues", defaultStringValues);
            } else {
                console.error(feature_types.messsage)
            }
        }
    }

    const handleFeatureTypeChange = async (feature_type) => {
        const site_id = cookies.credentials.site_id;
        const response = await MarGroundData.FetchOneMomsFeatures(feature_type, site_id);
        console.log("response", response);
        if (response.status) {
            if (response.data.length > 0) {
                const { feature_id } = response.data[0];
                const new_response = await MarGroundData.FetchMomsInstances(feature_id, site_id);
                console.log("new_response", new_response);
                if (new_response.status) {
                    setDefaultStrValues({
                        ...defaultStringValues,
                        "Feature Names": new_response.data
                    })
                } else {
                    console.error("Problem retrieving f names")
                }
            } 
        } else {
            console.error("Problem retrieving f types")
        }
    };

    const handleFeatureNameChange = async (feature_name) => {
        console.log(formData);
    };

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "Remarks": "",
        });
        setDefaultTSValues({
            "Observance TS": moment(),
        });
        setDefaultIntValues({
            "Alert Level": 0
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        console.log("data", data);
        console.log("formData", formData);
        console.log("defaultStringValues", defaultStringValues);
        // GET moms_features and moms_instances
        const temp_type_values = defaultStringValues["Feature Type"];
        console.log("temp_type_values", temp_type_values);
        const type_index = temp_type_values.findIndex(element => element.type === data.feature_type);
        if (type_index !== -1) temp_type_values[type_index]["default_val"] = true;

        setDefaultStrValues({
            ...defaultStringValues,
            "Remarks": data["remarks"],
            "Feature Type": temp_type_values,
        });
        setDefaultIntValues({
            "Alert Level": data["op_trigger"],
        });
        setDefaultTSValues({
            "Observance TS": data["observance_ts"],
        });
        setOpen(true);
        setCommand("edit");
    };

    const handleClose = () => {
        setOpen(false);
        resetState();
    };

    const handleDelete = (data) => {
        setSelectedData(data);
        handleOpenDelete();
    };

    const handleOpenDelete = () => {
        setOpen(false);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpen(true);
        setOpenDelete(false);
        resetState();
    }

    const deleteMoms = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = async () => {
        const input = {
            "moms_id": selectedData.moms_id
        };
        const response = await MarGroundData.DeleteMOMSData(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setNotifStatus("success");
        } else {
            setNotifStatus("error");
            setNotifText("Failed to delete moms data. Please contact the developers or file a bug report");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    const submit = async () => {
        console.log("formData.current", formData.current);
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const { observance_ts, } = defaultTSValues;
            const temp_ts = {
                observance_ts: moment( ).format("YYYY-MM-DD HH:mm:ss"),
            }
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            
            Object.keys(json).forEach(key => {
                let temp;
                console.log("key", key);
                switch(key) {
                    case 'StatDesc':
                        json["stat_desc"] = json[key]
                        break;
                    case 'InCharge':
                        json["in_charge"] = json[key]
                        break;
                    case 'Resource':
                        json["resource"] = json[key]
                        break;
                    default:
                        json[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
            });
            response = await MarGroundData.InsertMOMSData(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = []
            Object.keys(json).forEach(key => {
                let temp = {};
                console.log("key", key);
                switch(key) {
                    case 'StatDesc':
                        temp["stat_desc"] = json[key]
                        break;
                    case 'InCharge':
                        temp["in_charge"] = json[key]
                        break;
                    case 'Date':
                        temp["date"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarGroundData.UpdateMOMSData(temp_array);
        }

        if (response.status === true) {
            initTable();
            handleClose();
            setNotifStatus("success");
        } else {
            handleClose();
            setNotifStatus("error");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12} >
                    <FabMuiTable
                        classes={{}}
                        addLabel=""
                        data={{
                            columns: columns,
                            rows: tableData,
                        }}
                        handlers={{
                            handleAdd,
                            handleEdit,
                            handleDelete,
                        }}
                        customHandlers={{
                            moms_feature: handleFeatureTypeChange,
                            moms_instance: handleFeatureNameChange
                        }}
                        options={options}
                        cmd={cmd}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        * click row to Raise/Modify/Remove MOMS data.
                    </Typography>
                </Grid>
                <Grid container align="center">
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => setOpen(true)}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </Container>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">MOMS</DialogTitle>
            <DialogContent>
                <Forms data={{
                        string: defaultStringValues,
                        int: defaultIntValues,
                        ts: defaultTSValues
                    }}
                    formData={formData}
                    closeForm={() => handleClose()}
                    submitForm={() => submit()}
                    deleteForm={() => deleteMoms()} 
                />
            </DialogContent>
        </Dialog>

        <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this entry?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Removing this MOMS data cannot be undone. Are you sure you want to remove this entry?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDelete} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
                    Confirmed
                </Button>
            </DialogActions>
        </Dialog>

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>
    </Fragment>
    )
}
