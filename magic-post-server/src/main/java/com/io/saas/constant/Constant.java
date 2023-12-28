package com.io.saas.constant;

public class Constant {
	
	public static String SUCCESS = "Success";
	public static String ERROR = "Error";
	public static String SOMETHING_WRONG = "Some thing wrong";


	public static class UserRole {
		public static String MANAGER = "MANAGER";
		public static String LEADER_OF_COMMODITY_EXCHANGE = "LEADER_OF_COMMODITY_EXCHANGE";
		public static String EMPLOYEE_OF_COMMODITY_EXCHANGE = "EMPLOYEE_OF_COMMODITY_EXCHANGE";
		public static String LEADER_OF_COMMODITY_GATHERING = "LEADER_OF_COMMODITY_GATHERING";
		public static String EMPLOYEE_OF_COMMODITY_GATHERING = "EMPLOYEE_OF_COMMODITY_GATHERING";
		public static String USER_NORMAL = "USER_NORMAL";
	}

	public static class Item {
		public static String DOCUMENTATION_TYPE = "DOCUMENTATION_TYPE";
		public static String GOODS_TYPE = "GOODS_TYPE";


		public static String USER_RECEIVED_SUCCESSFUL = "USER_RECEIVED_SUCCESSFUL";
		public static String USER_RECEIVED_FAILED = "USER_RECEIVED_FAILED";

		public static String EXCHANGE = "EXCHANGE";
		public static String GATHERING = "GATHERING";
		public static String ALL_LOCATION = "ALL_LOCATION";



		public static String USER_SENT_TO_EXCHANGE = "USER_SENT_TO_EXCHANGE";
		public static String EXCHANGE_SENT_TO_GATHERING = "EXCHANGE_SENT_TO_GATHERING";
		public static String OLD_GATHERING_SENT_TO_NEW_GATHERING = "OLD_GATHERING_SENT_TO_NEW_GATHERING";
		public static String GATHERING_SENT_TO_EXCHANGE = "GATHERING_SENT_TO_EXCHANGE";
		public static String EXCHANGE_SENT_TO_USER = "EXCHANGER_SENT_TO_USER";
		public static String USER_SENT_TO_EXCHANGE_AGAIN = "USER_SENT_TO_EXCHANGE_AGAIN";
	}

}
