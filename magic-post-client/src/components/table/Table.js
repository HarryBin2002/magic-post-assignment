import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import "./table.css";
import {
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdOutlineDelete,
} from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import PopupOptions from "../popup/Popup";
import ViewItem from "../viewPopup/ViewItem";
import ViewExchange from "../viewPopup/ViewExchange";
import FormExchangeModal from "../formModal/FormExchangeModal";

const Table = ({ name, isFiltering, dataExchange, currentExchange }) => {
  const getStrings = (s) =>
    s != null ? (s?.length > 28 ? s?.substr(0, 24) + "..." : s) : "";
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);

  // remove item
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (exchangeId) => {
      setLoading(true);
      await makeRequest
        .post(
          `/manager/delete-exchange?exchangeId=${exchangeId}`,
          {},
          {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        )
        .then((res) => {
          successMessage("Item deleted.");
          setLoading(false);
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] });
    },
  });

  const handleRemoveItem = async (exchangeId) => {
    await mutation.mutateAsync(exchangeId);
  };

  const [openPopupDelete, setOpenPopupDelete] = useState(false);
  const [idItemDelete, setIdItemDelete] = useState("");

  const [openViewExchange, setOpenViewExchange] = useState(false);
  const [itemSelected, setItemSelected] = useState({});

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div class="table-box">
      {/* {isLoading && <Loading />} */}
      {/* table header  */}
      <div class="table-head">
        <div class="table-cell">
          <p>ID</p>
        </div>
        <div class="table-cell">
          <p>{name} Name</p>
        </div>
        <div class="table-cell">
          <p>{name} Address</p>
        </div>
        <div class="table-cell">
          <p>{name} leader id</p>
        </div>
        <div class="table-cell">
          <p></p>
        </div>
      </div>

      {/* table rows */}
      {currentExchange?.length <= 0 && isFiltering ? (
        <p>No exchange match</p>
      ) : (
        currentExchange?.map((item, index) => (
          <div class="table-row" key={index}>
            <div class="table-cell first-cell">
              <p>{getStrings(item.id)}</p>
            </div>
            <div class="table-cell second-cell">
              <p>{getStrings(item.exchangeName)}</p>
            </div>
            <div class="table-cell third-cell">
              <p>{getStrings(item.exchangeAddress)}</p>
            </div>
            <div class="table-cell last-cell">
              <p>{getStrings(item.exchangeLeaderId)}</p>
            </div>
            <div class="table-cell table-actions">
              <MdOutlineRemoveRedEye
                className="table-actions-icon add"
                onClick={() => {
                  setItemSelected(item);
                  setOpenViewExchange(true);
                }}
              />
              <MdOutlineEdit
                className="table-actions-icon edit"
                onClick={() => {
                  setItemSelected(item);
                  setOpenEdit(true);
                }}
              />
              <MdOutlineDelete
                className="table-actions-icon delete"
                onClick={() => {
                  setOpenPopupDelete(true);
                  setIdItemDelete(item.id);
                }}
              />
            </div>
          </div>
        ))
      )}
      {dataExchange?.length <= 0 ? (
        <p></p>
      ) : (
        !isFiltering &&
        dataExchange?.map((item, index) => (
          <div class="table-row" key={index}>
            <div class="table-cell first-cell">
              <p>{getStrings(item.id)}</p>
            </div>
            <div class="table-cell second-cell">
              <p>{getStrings(item.exchangeName)}</p>
            </div>
            <div class="table-cell third-cell">
              <p>{getStrings(item.exchangeAddress)}</p>
            </div>
            <div class="table-cell last-cell">
              <p>{getStrings(item.exchangeLeaderId)}</p>
            </div>
            <div class="table-cell table-actions">
              <MdOutlineRemoveRedEye
                className="table-actions-icon add"
                onClick={() => {
                  setItemSelected(item);
                  setOpenViewExchange(true);
                }}
              />
              <MdOutlineEdit
                className="table-actions-icon edit"
                onClick={() => {
                  setItemSelected(item);
                  setOpenEdit(true);
                }}
              />
              <MdOutlineDelete
                className="table-actions-icon delete"
                onClick={() => {
                  setOpenPopupDelete(true);
                  setIdItemDelete(item.id);
                }}
              />
            </div>
          </div>
        ))
      )}
      {openPopupDelete && (
        <PopupOptions
          title="Delete exchange"
          handleAction={() => handleRemoveItem(idItemDelete)}
          loading={loading}
          setOpenPopup={setOpenPopupDelete}
        />
      )}
      {openViewExchange && (
        <ViewExchange
          item={itemSelected}
          closeVisible={() => setOpenViewExchange(false)}
        />
      )}

      {openEdit && (
        <FormExchangeModal
          item={itemSelected}
          closeFormModal={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
};

export default Table;
