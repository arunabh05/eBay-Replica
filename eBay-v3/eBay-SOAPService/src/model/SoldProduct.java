package model;

public class SoldProduct {

	private int itemid;
	private String username;
	private String itemname;
	private String itemdesc;
	private int itemprice;
	private int itemquantity;
	private String itemimg;
	private String selltime;
	private String bid;
	private String sellername;
	private String sellerphone;
	private String address;
	
	public int getItemid() {
		return itemid;
	}

	public void setItemid(int itemid) {
		this.itemid = itemid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getItemname() {
		return itemname;
	}

	public void setItemname(String itemname) {
		this.itemname = itemname;
	}

	public String getItemdesc() {
		return itemdesc;
	}

	public void setItemdesc(String itemdesc) {
		this.itemdesc = itemdesc;
	}

	public int getItemprice() {
		return itemprice;
	}

	public void setItemprice(int itemprice) {
		this.itemprice = itemprice;
	}

	public int getItemquantity() {
		return itemquantity;
	}

	public void setItemquantity(int itemquantity) {
		this.itemquantity = itemquantity;
	}

	public String getItemimg() {
		return itemimg;
	}

	public void setItemimg(String itemimg) {
		this.itemimg = itemimg;
	}

	public String getSelltime() {
		return selltime;
	}

	public void setSelltime(String selltime) {
		this.selltime = selltime;
	}

	public String getBid() {
		return bid;
	}

	public void setBid(String bid) {
		this.bid = bid;
	}

	public String getSellername() {
		return sellername;
	}

	public void setSellername(String sellername) {
		this.sellername = sellername;
	}

	public String getSellerphone() {
		return sellerphone;
	}

	public void setSellerphone(String sellerphone) {
		this.sellerphone = sellerphone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public SoldProduct(int itemid, String username, String itemname, String itemdesc, int itemprice, int itemquantity,
			String itemimg, String selltime, String bid, String sellername, String sellerphone, String address) {
		super();
		this.itemid = itemid;
		this.username = username;
		this.itemname = itemname;
		this.itemdesc = itemdesc;
		this.itemprice = itemprice;
		this.itemquantity = itemquantity;
		this.itemimg = itemimg;
		this.selltime = selltime;
		this.bid = bid;
		this.sellername = sellername;
		this.sellerphone = sellerphone;
		this.address = address;
	}

	public SoldProduct() {
		super();
	}
	
	
	
	
	
}
