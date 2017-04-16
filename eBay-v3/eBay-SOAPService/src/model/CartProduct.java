package model;

public class CartProduct {

	private int cartid;
	public int itemid;
	private String username;
	private String itemname;
	private int itemprice;
	public int itemquantity;
	private String itemimg;
	private int itemcost;
	private String product_status;
	public int getCartid() {
		return cartid;
	}
	public void setCartid(int cartid) {
		this.cartid = cartid;
	}
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
	public int getItemcost() {
		return itemcost;
	}
	public void setItemcost(int itemcost) {
		this.itemcost = itemcost;
	}
	public String getProduct_status() {
		return product_status;
	}
	public void setProduct_status(String product_status) {
		this.product_status = product_status;
	}
	public CartProduct() {
		super();
	}
	public CartProduct(int cartid, int itemid, String username, String itemname, int itemprice, int itemquantity,
			String itemimg, int itemcost, String product_status) {
		super();
		this.cartid = cartid;
		this.itemid = itemid;
		this.username = username;
		this.itemname = itemname;
		this.itemprice = itemprice;
		this.itemquantity = itemquantity;
		this.itemimg = itemimg;
		this.itemcost = itemcost;
		this.product_status = product_status;
	}
}
