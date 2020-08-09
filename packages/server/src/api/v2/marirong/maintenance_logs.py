from flask import Blueprint, jsonify, request
from datetime import datetime
from calendar import monthrange
from werkzeug.datastructures import ImmutableMultiDict
from flask_cors import CORS, cross_origin
from connections import SOCKETIO
from src.model.v2.mar.maintenance_logs import Maintenance as maintenance
from src.api.helpers import Helpers as helpers
from config import APP_CONFIG

MAINTENANCE_LOGS_BLUEPRINT = Blueprint(
    "maintenance_logs_blueprint", __name__)


@MAINTENANCE_LOGS_BLUEPRINT.route("/add/maintenance/mar/maintenance_logs", methods=["POST"])
@cross_origin()
def add():
    data = request.get_json()
    response = maintenance.create_maintenance_log(data)
    if response:
        return_value = {
            "status": True,
            "maintenance_log_id": response,
            "message": "New maintenance log data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "maintenance_log_id": None,
            "message": "Failed to add maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/maintenance/mar/maintenance_logs/", methods=["GET"])
@cross_origin()
def fetch():
    try:
        result = maintenance.fetch_all_maintenance_log()
        for x in result:
            x['maintenance_date'] = str(x['maintenance_date'])
            x['last_ts'] = str(x['last_ts'])
        response = {
            "status": True,
            "message": 'Successfully fetch maintenance logs.',
            "data": result
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching maintenance logs. Err: {err}'
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/day/maintenance/mar/maintenance_logs/<input_date>", methods=["GET"])
@cross_origin()
def fetch_day(input_date):
    try:
        input_date = helpers.str_to_dt(input_date)
        start = datetime(input_date.year, input_date.month, input_date.day, 0, 0, 0)
        end = datetime(input_date.year, input_date.month, input_date.day, 23, 59, 0)
        result = maintenance.fetch_filtered_maintenance_log(start, end)
        response = {
            "status": True,
            "data": result,
            "message": "Sucessfully fetched incident logs."
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching maintenance logs. Err: {err}'
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/month/maintenance/mar/maintenance_logs/<start>/<end>", methods=["GET"])
@cross_origin()
def fetch_month(start, end):
    try:
        result = maintenance.fetch_filtered_maintenance_log(start, end)
        response = {
            "status": True,
            "message": 'Successfully fetch maintenance logs.',
            "data": result
        }
    except Exception as err:
        raise
        response = {
            "status": False,
            "message": f'Error fetching maintenance logs. Err: {err}'
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/update/maintenance/mar/maintenance_logs", methods=["PATCH"])
@cross_origin()
def update():
    data = request.get_json()
    result = maintenance.update_maintenance_log(data)
    if result is not None:
        return_value = {
            "status": True,
            "message": "Maintenance logs data successfully updated!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to update maintenance logs data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/delete/maintenance/mar/maintenance_logs", methods=["DELETE"])
@cross_origin()
def remove():
    print("SHIIIIIIIIIIIIIT")
    data = request.get_json()
    helpers.var_checker("data", data)
    status = maintenance.delete_maintenance_log(data['id'])
    helpers.var_checker("status", status)
    if status == "0":
        return_value = {
            "status": True,
            "message": "Maintenance log data successfully deleted!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to delete maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/maintenance/maintenance_logs/upload_log_attachment", methods=["POST"])
@cross_origin()
def upload_log_attachment():
    try:
        file = request.files['file']
        form_json = request.form.to_dict(flat=False)
        maintenance_log_id = form_json["maintenance_log_id"][0]
        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
        final_path = helpers.upload(file=file, file_path=file_path)

        response = {
            "ok": True,
            "message": "Log attachment OKS!",
            "file_path": final_path
        }

    except Exception as err:
        print(err)
        response = {
            "ok": False,
            "message": "Log attachment NOT oks!",
            "file_path": "ERROR"
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/maintenance/maintenance_logs/fetch_log_attachments/<maintenance_log_id>", methods=["GET"])
@cross_origin()
def fetch_log_attachments(maintenance_log_id):
    try:

        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
        files = helpers.fetch(file_path)

        response = {
            "ok": True,
            "message": "Log attachment fetch OKS!",
            "data": files
        }

    except Exception as err:
        print(err)
        response = {
            "ok": False,
            "message": "Log attachment fetch NOT oks!",
            "data": []
        }

    return jsonify(response)