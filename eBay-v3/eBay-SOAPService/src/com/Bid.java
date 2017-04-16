package com;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.jws.WebService;
import org.json.JSONObject;
import DBUtil.DBConnect;
import model.Bids;


@WebService
public class Bid {

	public int makeBid(String username, String itemid, String amount){
		
		String query = "insert into bidding_placed (itemid,itemname,username,itemquantity,amount,selltime ,biddingtime) values " +
				"("+Integer.parseInt(itemid)+",(select itemname from sell_product where itemid="+Integer.parseInt(itemid)+")," +
				"'"+username+"',1,"+Integer.parseInt(amount)+",(select selltime from sell_product where itemid = "
				+Integer.parseInt(itemid)+"),now());";

	
		
		DBConnect db = new DBConnect();
		int a = db.querySQL(query);
		return a;
	
	}
	
	
	public String currentHighest(){
		ArrayList<Bids> bidL = new ArrayList<Bids>();
		ResultSet rs = null;
		JSONObject json = new JSONObject();
		String query = "SELECT t.itemid, t.itemname, t.username, t.amount as bid FROM ( SELECT itemid , MAX(amount) AS"
				+ " bid1 FROM bidding_placed where biddingtime <= selltime + interval 4 day and now() <= selltime + interval 4 day "
				+ "GROUP BY itemid ) AS m INNER JOIN bidding_placed AS t ON t.itemid = m.itemid AND t.amount = m.bid1;";

		
		
		
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		
		try {
			while(rs.next()){
				Bids bid = new Bids(rs.getInt(1),rs.getString(2),rs.getString(3),rs.getInt(4));
				
				bidL.add(bid);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		
		json.put("productList", bidL);
		String bidListt = json.toString();
		return bidListt;

	}
	
	
	public String bidWinners(){
		ArrayList<Bids> winL = new ArrayList<Bids>();
		ResultSet rs = null;
		JSONObject json = new JSONObject();

		String query ="SELECT t.itemid, t.itemname, t.username, t.amount as bid FROM ( SELECT itemid , MAX(amount) AS bid1 "
				+ "FROM bidding_placed where now() >= selltime + interval 4 day GROUP BY itemid ) AS m INNER JOIN bidding_placed"
				+ " AS t ON t.itemid = m.itemid AND t.amount = m.bid1;";
	
		DBConnect db = new DBConnect();
		rs = db.Query_Return(query);
		
		try {
			while(rs.next()){
				Bids bid = new Bids(rs.getInt(1),rs.getString(2),rs.getString(3),rs.getInt(4));
				
				winL.add(bid);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		
		json.put("productList", winL);
		String winListt = json.toString();
		return winListt;
	}
}
