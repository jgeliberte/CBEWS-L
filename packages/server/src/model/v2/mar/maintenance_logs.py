from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class Maintenance():

	def create_maintenance_log(data):
		query = f'INSERT INTO maintenance_logs (maintenance_date, type, remarks, in_charge, updater, user_id, last_ts) ' \
				f"VALUES ('{data['maintenance_date']}', '{data['type']}', '{data['remarks']}', '{data['in_charge']}', '{data['updater']}', '{data['user_id']}', '{str(dt.today())}')"
		maintenance_log_id = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return maintenance_log_id

	def fetch_maintenance_log(site_id, maintenance_log_id=None):
		query = 'SELECT * FROM maintenance_logs'
		where_clause = ""
		if maintenance_log_id:
			where_clause = f'maintenance_log_id = {maintenance_log_id}'

		if where_clause:
			query = f'{query} WHERE {where_clause}'

		result = DB.db_read(query, 'cbewsl_mar_collections')
		return result
	
	def update_maintenance_log(data):
		query = "UPDATE maintenance_logs SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
			else:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
			counter += 1
		ret_val = DB.db_modify(query,'cbewsl_mar_collections', True)
		return ret_val
		

	def delete_maintenance_log(id):
		query = f'DELETE FROM maintenance_logs WHERE id = { id }'
		result = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return result

	##########################
	# INCIDENT REPORT MODELS #
	##########################

	def create_incident_report(data):
		(report_ts, description, reporter, site_id) = data.values()
		schema = DB.db_switcher(site_id)
		query = f'INSERT INTO incident_reports (report_ts, description, reporter) ' \
				f'VALUES ("{report_ts}", "{description}", "{reporter}")'
		ir_id = DB.db_modify(query, schema, True)
		return ir_id

	def fetch_incident_report(site_id, ir_id=None, ts_dict={}):
		"""
		Args:
			site_id
			ir_id (int/None)
			ts_dict (Dictionary) - { start: string, end: string }
		"""
		query = 'SELECT * FROM incident_reports'
		where_clause = ""
		if ir_id:
			where_clause = f'ir_id = {ir_id}'
		elif ts_dict.items():
			where_clause = f'"{ts_dict["start"]}" <= report_ts AND report_ts <= "{ts_dict["end"]}"'

		if where_clause:
			query = f'{query} WHERE {where_clause}'

		schema = DB.db_switcher(site_id)
		result = DB.db_read(query, schema)
		if result:
			temp = []
			for row in result:
				temp.append({
					"ir_id": row[0],
					"report_ts": h.dt_to_str(row[1]),
					"description": row[2],
					"reporter": row[3]
				})
			result = temp
		return result
	
	def update_incident_report(data):
		(ir_id, report_ts, description, reporter, site_id) = data.values()
		query = f'UPDATE incident_reports SET ' \
			f'report_ts="{report_ts}", description="{description}", ' \
			f'reporter="{reporter}" ' \
			f'WHERE ir_id="{ ir_id }"'
		schema = DB.db_switcher(site_id)
		result = DB.db_modify(query, schema, True)
		return result

	def delete_incident_report(ir_id, site_id):
		query = f'DELETE FROM incident_reports WHERE ir_id = { ir_id }'
		schema = DB.db_switcher(site_id)
		result = DB.db_modify(query, schema, True)
		return result
