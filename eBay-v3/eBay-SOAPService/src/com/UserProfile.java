package com;

import DBUtil.*;
import javax.jws.WebService;

@WebService
public class UserProfile {

	public int updateProfile(String username, String bday, String phone, String address) {

		String query = "update user_profile SET bday='" + bday + "', phone ='" + phone + "', address='" + address
				+ "' where username='" + username + "';";
		
		
		try {
			DBConnect db = new DBConnect();
			int a = db.querySQL(query);
			return a;
		} catch (Exception e) {
			return 0;
		}
	}

}
