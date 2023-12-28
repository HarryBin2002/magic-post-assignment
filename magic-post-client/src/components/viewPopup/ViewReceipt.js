import "./viewReceipt.scss";
import { AiOutlineClose } from "react-icons/ai";

const ViewReceipt = ({ closeVisible, item }) => {
  return (
    <div class="view-popup-receipt">
      <div className="view-popup-receipt-container">
        <h1 style={{ margin: "0 0 10px 0", textAlign: "center" }}>
          Magic Post
        </h1>

        <div className="view-popup-receipt-main">
          <div className="view-popup-receipt-left">
            <div className="view-popup-one">
              <p className="view-popup-left-title">
                1. Họ tên địa chỉ người gửi:
              </p>
              <p>{item?.sendingItemUser?.name}</p>
              <p>{item?.sendingItemUser?.address}</p>
              <p
                className="view-popup-left-phone"
                style={{
                  display: "flex",
                  gap: "5px",
                  marginTop: "8px",
                }}
              >
                <b>Điện thoại: </b>
                <p>{item?.sendingItemUser?.phoneNumber}</p>
              </p>
              <p
                className="view-popup-left-ma"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <b>Mã khách hàng: </b>
                <span
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <b>Mã bưu chính: </b>
                  <p>03128</p>
                </span>
              </p>
            </div>
            <div className="view-popup-second" style={{ padding: "10px" }}>
              <p className="view-popup-left-title">3. Loại hàng gửi:</p>
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <p
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <input type="checkbox" checked="true" /> <span>Tài liệu</span>
                </p>
                <p
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <input type="checkbox" /> <span>Hàng hóa</span>
                </p>
              </p>
            </div>
            <div>
              <p
                className="view-popup-left-title"
                style={{ padding: "0 10px 10px 10px" }}
              >
                4. Nội dung giá trị bưu gửi:
              </p>
              <table
                border="1px"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <tr>
                  <td>Nội dung</td>
                  <td>Số lượng</td>
                  <td>Trị giá</td>
                  <td>Giấy tờ đính kèm</td>
                </tr>
                <tr>
                  <td>Tổng</td>
                  <td>0</td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              <p className="view-popup-left-title">
                5. Dịch vụ đặc biệt cộng thêm:
              </p>
              <p style={{ width: "100%", padding: "0 10px 0 10px" }}>
                ....................................................................................
              </p>
              <p style={{ width: "100%", padding: "0 10px 0 10px" }}>
                ....................................................................................
              </p>
              <p>Mã hợp đồng EMSC/PPA</p>
            </div>

            <div
              style={{
                padding: "10px",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              <p className="view-popup-left-title">
                6. Chỉ dẫn của người gửi khi không phát được bưu gửi:
              </p>
              <input type="checkbox" />
              <span>Chuyển hoàn ngay</span>
              <input type="checkbox" style={{ marginLeft: "20px" }} />
              <span>Gọi điện cho người gửi/BC gửi</span>
              <input type="checkbox" style={{ marginLeft: "120px" }} />
              <span>Hủy</span>
              <input type="checkbox" style={{ marginTop: "20px" }} />
              <span>Chuyển hoàn trước ngay</span>
              <input type="checkbox" style={{ marginLeft: "20px" }} />
              <span>Chuyển hoàn khi hết hạn thời gian lưu trữ</span>
            </div>

            <div
              style={{
                padding: "10px",
                borderTop: "1px solid black",
              }}
            >
              <p className="view-popup-left-title">7. Cam kết của người gửi:</p>
              <p>
                Tôi chấp nhận các điều khoản tại mặt sau của phiếu gửi và cam
                đoan bưu gửi này không chứa những mặt hàng nguy hiểm, cấm gửi.
                Trường hợp không phát được hãy thực hiện chỉ dẫn tại mục 6, tôi
                sẽ trả cước chuyển khoản.
              </p>
              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <p className="view-popup-left-title">8. Ngày giờ gửi:</p>
                  <p>07h52/18/10/2023</p>
                </div>
                <div style={{ marginLeft: "200px" }}>
                  <p className="view-popup-left-title">Chữ ký người gửi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="view-popup-receipt-right">
            <div className="view-popup-one">
              <p className="view-popup-left-title">
                2. Họ tên địa chỉ người nhận:
              </p>
              <p>{item?.receivingItemUser?.name}</p>
              <p>{item?.receivingItemUser?.address}</p>
              <p
                className="view-popup-left-phone"
                style={{
                  display: "flex",
                  gap: "5px",
                  marginTop: "8px",
                }}
              >
                <b>Mã ĐH: </b>
                <p>031381212</p>
              </p>
              <p
                className="view-popup-left-ma"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ display: "flex", gap: "5px" }}>
                  <b>Điện thoại: </b>
                  <p>{item?.receivingItemUser?.phoneNumber}</p>
                </p>
                <span
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <b>Mã bưu chính: </b>
                  <p>03128</p>
                </span>
              </p>
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              <div style={{ borderBottom: "1px solid black", flex: "1.6" }}>
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <p className="view-popup-left-title">9. Cước:</p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>a. Cước chính:</p>
                    <p>9.500</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>b. Phụ phí:</p>
                    <p>1.900</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>c. Cước GTGT:</p>
                    <p>0</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>d. Tổng cước ( Gồm VAT ):</p>
                    <p>12.312</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>e. Thu khác:</p>
                    <p>0</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <b>f. Tổng thu:</b>
                    <b>12.312</b>
                  </p>
                </div>

                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <p className="view-popup-left-title">
                    11. Thu của người nhận:
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>COD:</p>
                    <p>0</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Thu khác:</p>
                    <p>0</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Tổng thu:</p>
                    <p>0</p>
                  </p>
                </div>
              </div>

              <div
                style={{
                  flex: "1",
                  borderBottom: "1px solid black",
                  borderLeft: "1px solid black",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  <p className="view-popup-left-title">10. Khối lượng (kg):</p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Khối lượng thực tế: </p>
                    <p>30</p>
                  </p>
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>Khối lượng quy đổi: </p>
                    <p>0</p>
                  </p>
                </div>

                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid black",
                  }}
                >
                  <p className="view-popup-left-title">12. Chú dẫn nghiệp vụ</p>
                  <p>1</p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderTop: "1px solid black",
              }}
            >
              <div
                style={{
                  flex: "1.6",
                  padding: "10px",
                  borderRight: "1px solid black",
                  height: "230px",
                }}
              >
                <p
                  className="view-popup-left-title"
                  style={{ textAlign: "center" }}
                >
                  13. Bưu cục chấp nhận
                </p>
                <p style={{ textAlign: "center" }}>Chữ ký GDV nhận</p>
              </div>

              <div
                style={{
                  flex: "1",
                  padding: "6.5px",
                  borderLeft: "1px solid black",
                }}
              >
                <p className="view-popup-left-title">14. Ngày giờ nhận</p>
                <p>........h......../......../20........</p>
                <p style={{ textAlign: "center" }}>
                  Người nhận/ người được gửi ủy quyền nhận
                </p>
                <p style={{ textAlign: "center" }}>(Ký ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AiOutlineClose
        className="view-popup-receipt-close"
        onClick={closeVisible}
      />
    </div>
  );
};

export default ViewReceipt;
