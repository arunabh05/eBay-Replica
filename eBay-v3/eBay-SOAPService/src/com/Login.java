package com;

import bCrypt.org.mindrot.jbcrypt.*;
import DBUtil.*;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;
import model.*;

@WebService
public class Login {
	ResultSet rs = null;
	public User checkLogin(String username, String password) throws SQLException{
		
		String query = "select * from user_login where username='"+ username+"';";
		
		DBConnect db = new DBConnect();
		User user = null;
		rs = db.Query_Return(query);
		while(rs.next()){
			if(BCrypt.checkpw(password, rs.getString(2))){
			 user = new User(rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5),rs.getString(6));
			}
		}	
		return user;
	}	
}
