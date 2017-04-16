package DBUtil;

import java.sql.*;

public class DBConnect {
	Connection conn;

	public DBConnect() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/ebayapp", "root", "root123");

		} catch (Exception ex) {

		}
	}

	public int querySQL(String sql) {
		try {
			Statement stat = conn.createStatement();
			stat.execute(sql);
			stat.close();
			return 1;

		} catch (Exception ex) {
			System.out.println(ex.getMessage());
			return 0;
		}
	}

	public ResultSet Query_Return(String sql) {
		ResultSet rs = null;
		try {
			System.out.println(sql);

			Statement stat = conn.createStatement();
			rs = stat.executeQuery(sql);
		} catch (Exception ex) {
		}
		return rs;
	}
}
