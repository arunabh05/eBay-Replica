package model;

public class Bids {

	private String username;
	private int amount;
	private int itemid;
	private String itemname;
	public Bids(int itemid,String username,  String itemname, int amount) {
		super();
		this.username = username;
		this.amount = amount;
		this.itemid = itemid;
		this.itemname = itemname;
	}
	public Bids() {
		super();
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public int getItemid() {
		return itemid;
	}
	public void setItemid(int itemid) {
		this.itemid = itemid;
	}
	public String getItemname() {
		return itemname;
	}
	public void setItemname(String itemname) {
		this.itemname = itemname;
	}
}
