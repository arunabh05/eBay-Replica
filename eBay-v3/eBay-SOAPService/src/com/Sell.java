package com;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import javax.jws.WebService;

import org.json.JSONObject;

import com.google.gson.Gson;

import DBUtil.DBConnect;
import model.*;

@WebService
public class Sell {

	String query;

	public int sellProduct(String username, String itemName, String itemDesc, String itemPrice, int itemQuantity,
		String itemImg, boolean bid) {
		Date date = new Date();
		Timestamp timestamp = new Timestamp(date.getTime());
		if (bid == true) {
			query = "insert into sell_product(username, itemname,itemdesc,itemprice,itemquantity, selltime,itemimg "
					+ ",bid,sellername,sellerphone,selleraddress) values('" + username + "','" + itemName + "'" + ",'"
					+ itemDesc + "'," + Integer.parseInt(itemPrice) + "," + itemQuantity + "," + timestamp + ",'"
					+ itemImg + "','yes',(select firstname from user_login where username='" + username + "'),"
					+ "(select phone from user_profile where username='" + username
					+ "'),(select address from user_profile where " + "username='" + username + "'));";
			
			
		} else {
			query = "insert into sell_product(username, itemname,itemdesc,itemprice,itemquantity, selltime,itemimg "
					+ ",bid,sellername,sellerphone,selleraddress) values('" + username + "','" + itemName + "'" + ",'"
					+ itemDesc + "'," + Integer.parseInt(itemPrice) + "," + itemQuantity + "," + timestamp + ",'"
					+ itemImg + "','no',(select firstname from user_login where username='" + username + "'),"
					+ "(select phone from user_profile where username='" + username
					+ "'),(select address from user_profile where " + "username='" + username + "'));";
		}

			DBConnect db = new DBConnect();
			int a = db.querySQL(query);
			return a;
	}
	
	public String getSoldProducts(String username){
		ArrayList<SoldProduct> soldProducts = new ArrayList<SoldProduct>();
		ResultSet rs = null;
		
		String query = "select * from sell_product where username='"+username+"';";
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		
		try {
			while(rs.next()){
				SoldProduct sp = new SoldProduct(rs.getInt(1), rs.getString(2),rs.getString(3),rs.getString(4),rs.getShort(5), rs.getInt(6),rs.getString(7)
						,(rs.getTimestamp(8)).toString(), rs.getString(9), rs.getString(10),rs.getString(11),rs.getString(12));
				
				soldProducts.add(sp);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		
		
		}
		Gson gson = new Gson();
		String json = gson.toJson(soldProducts);
		return json;
	}
	
	public String getPurchasedProducts(String username){
		ArrayList<CartProduct> cart = new ArrayList<CartProduct>();
		ResultSet rs = null;
		String query = "select * from shopping_cart where username='"+username + "' and product_status = 'yes';";
		
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		try {
			while(rs.next()){
				CartProduct cartItem = new CartProduct(rs.getInt(1), rs.getShort(2),rs.getString(3), rs.getString(4),
									    rs.getInt(5), rs.getInt(6),rs.getString(7), rs.getInt(8), rs.getString(9));
				cart.add(cartItem);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		Gson gson = new Gson();
		String json = gson.toJson(cart);
		return json;
	}
}
