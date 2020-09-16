import AppConfig from '../../utils/AppConfig';

const GetSubsurfacePlotData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/umi/subsurface/plot/data`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Error on fetching all surficial markers data. Err: ", error);
    });
};

export { GetSubsurfacePlotData }
