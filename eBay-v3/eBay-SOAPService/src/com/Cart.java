package com;

import javax.jws.WebService;

import org.json.JSONObject;

import com.google.gson.Gson;

import DBUtil.*;
import model.CartProduct;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

@WebService
public class Cart {
	public String getCartItems(String username) {
		String query = "select * from shopping_cart where username='" + username + "' and product_status = 'no';";

		ArrayList<CartProduct> cartL = new ArrayList<CartProduct>();
		ResultSet rs = null;
		JSONObject json = new JSONObject();

		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);

		try {
			while (rs.next()) {
				CartProduct cartItem = new CartProduct(rs.getInt(1), rs.getShort(2), rs.getString(3), rs.getString(4),
						rs.getInt(5), rs.getInt(6), rs.getString(7), rs.getInt(8), rs.getString(9));

				cartL.add(cartItem);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		json.put("productList", cartL);
		String cartListt = json.toString();
		return cartListt;
	}

	public int removeCartItem(String cartId) {
		String query = "delete from shopping_cart where cartid = '" + cartId + "';";
		DBConnect db = new DBConnect();
		int a = db.querySQL(query);
		return a;
	}

	public int checkout(String username, String itemsL){
		Gson gson = new Gson();
		CartProduct[] items = (CartProduct[]) gson.fromJson(itemsL, CartProduct[].class);

		
		DBConnect db = new DBConnect();

		
		for (CartProduct cartProduct : items) {
	
			String query2 = "UPDATE  sell_product SET itemquantity = GREATEST(0, itemquantity - "+cartProduct.itemquantity+")" +
					"WHERE  itemid = " + cartProduct.itemid + ";";
			String query3 = "UPDATE  shopping_cart SET product_status = 'yes' where username = '"+username+"';";
				 db.querySQL(query2);
				 db.querySQL(query3);
		}
		
		String query = "update shopping_cart set product_status = 'yes' where username = '"+username + "';";
		int a = db.querySQL(query);
		return a;
	}
}
