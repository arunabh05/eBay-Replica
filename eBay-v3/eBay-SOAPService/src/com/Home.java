package com;

import javax.jws.WebService;

import org.json.JSONObject;

import DBUtil.*;

import model.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

@WebService
public class Home {

	public User getProfile(String username){
		User user= null;
		String query = "select * from user_login where username='"+ username + "';";
		ResultSet rs = null;
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		try {
			while(rs.next()){
				 user = new User(rs.getString(1), rs.getString(2),rs.getString(3), rs.getString(4),rs.getString(5), rs.getString(6));		
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		String query2 = "select * from user_profile where username='"+ username + "';";
		ResultSet rs2 = null;
		rs2 = db.Query_Return(query2);
		
		try {
			while(rs2.next()){
				 user.setBday(rs2.getString(2));
				 user.setPhone(rs2.getString(3));
				 user.setAddress(rs2.getString(4));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}
	
	
	
	public String getProducts(String username){
		ArrayList<SoldProduct> productList = new ArrayList<SoldProduct>();
		ResultSet rs = null;
		JSONObject json = new JSONObject();
		String query = "select * from sell_product where NOT username='"+username+"';";
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		
		try {
			while(rs.next()){
				SoldProduct sp = new SoldProduct(rs.getInt(1), rs.getString(2),rs.getString(3),rs.getString(4),rs.getShort(5), rs.getInt(6),rs.getString(7)
						,(rs.getTimestamp(8)).toString(), rs.getString(9), rs.getString(10),rs.getString(11),rs.getString(12));
				
				productList.add(sp);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		Object[] sp = productList.toArray();
		
		json.put("productList", sp);
		String productListt = json.toString();
		return productListt;
	}
	
	
	public int logout(String username){
		String query = "update user_login SET last_login=now() where username='"+username + "';";
		DBConnect db = new DBConnect();
		int a = db.querySQL(query);
		return a;
	}
	
	
	public int addToCart(String username, String itemid, String price, String quantity, int cost){
		
		String query = "insert into shopping_cart (itemid,itemname,username,itemprice,itemquantity,itemimg,itemcost,product_status) values " +
				"("+Integer.parseInt(itemid)+",(select itemname from sell_product where itemid="+Integer.parseInt(itemid)+")," +
				"'"+username+"',"+Integer.parseInt(price)+","+Integer.parseInt(quantity)+",(select itemimg from sell_product" +
				" where itemid='"+Integer.parseInt(itemid)+"'),"+cost+",'no');";
		
		DBConnect db = new DBConnect();
		int a = db.querySQL(query);
		return a;
	
		
	
	}
}
