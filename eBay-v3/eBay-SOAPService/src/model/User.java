package model;

public class User {

	private String username;
	private String password;
	private String email;
	private String last_login;
	private String firstname;
	private String lastname;
	private String bday;
	private String phone;
	private String address;
	
	public String getBday() {
		return bday;
	}
	public void setBday(String bday) {
		this.bday = bday;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public User(){};
	public User(String u,String p,String e,String l,String fN,String lN){
		username = u;
		password = p;
		email = e;
		last_login = l;
		firstname = fN;
		lastname = lN;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getLast_login() {
		return last_login;
	}


	public void setLast_login(String last_login) {
		this.last_login = last_login;
	}


	public String getfirstname() {
		return firstname;
	}


	public void setfirstname(String firstname) {
		this.firstname = firstname;
	}


	public String getlastname() {
		return lastname;
	}


	public void setlastname(String lastname) {
		this.lastname = lastname;
	}
}
