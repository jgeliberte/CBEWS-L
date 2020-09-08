from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
import json
import time
from datetime import datetime as dt
from datetime import timedelta as td
from src.model.ground_data import GroundData
from src.api.helpers import Helpers as h
from config import APP_CONFIG

SURFICIAL_ANALYSIS_BLUEPRINT = Blueprint("surficial_analysis_blueprint", __name__)

@SURFICIAL_ANALYSIS_BLUEPRINT.route("/get/data_analysis/<site_code>/surficial/plot_data", methods=["GET"])
def fetch(site_code):
    surficial_plot = []
    site_id = APP_CONFIG["site_ids"][site_code]
    markers = GroundData.fetch_surficial_markers(site_id) #Leave this for now
    ts_end = dt.today().strftime("%Y-%m-%d %H:%M:%S")
    ts_start = dt.today() - td(days=200) # for data sampling
    ts_start = ts_start.strftime("%Y-%m-%d %H:%M:%S")

    for marker in markers:
        marker_id = marker["marker_id"]
        marker_name = marker["marker_name"]
        prelim_data = {
            'marker_id': marker_id,
            'marker_name': marker_name,
            'name': marker_name,
            'data': []
        }
        surficial_plot_data = GroundData.fetch_surficial_plot_data(marker_id, site_code, ts_start, ts_end)
        for row in surficial_plot_data:
            row["x"] = h.str_to_dt(row["x"]).timestamp()
            prelim_data['data'].append(row)
        surficial_plot.append(prelim_data)

    ret_val = {
        'status': True, 
        'surficial_plot': surficial_plot,
        'ts_start': ts_start,
        'ts_end': ts_end,
        'site_code': site_code
    }

    return jsonify(ret_val)