package com;

import javax.jws.WebService;
import DBUtil.*;
import model.*;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebService
public class EbayHandle {

	public User getUserDetails(String ebayHandle) throws SQLException{
		User user = null;
		ResultSet rs = null;
		DBConnect db = new DBConnect();
		
		String query = "select firstname, lastname, bday, address, phone from  user_profile a JOIN user_login b ON a.username = " +
				"b.username and a.username = '"+ebayHandle+"';";
		
		rs = db.Query_Return(query);
		while(rs.next()){
			user = new User();
			user.setfirstname(rs.getString(1));
			user.setlastname(rs.getString(2));
			user.setBday(rs.getString(3));
			user.setAddress(rs.getString(4));
			user.setPhone(rs.getString(5));
		}	

		return user;

	}
}
