package com;

import DBUtil.*;
import javax.jws.WebService;

import java.sql.Timestamp;
import java.util.*;

@WebService
public class Register {

	public int registerUser(String username, String password, String email, String firstName, String lastName) {
		Date date = new Date();
		Timestamp timestamp = new Timestamp(date.getTime());
		String query = "insert into user_login values ('" + username + "','" + password + "','" + email + "','"
				+ timestamp + "' ,'" + firstName + "','" + lastName + "'); ";

		String query2 = "insert into user_profile values ('" + username + "','','',''); ";
		try {
			DBConnect db = new DBConnect();
			int a = db.querySQL(query);
			int b = db.querySQL(query2);

			if (a == 1 && b == 1) {
				return 1;
			}
		} catch (Exception e) {

		}
		return 0;
	}
}
