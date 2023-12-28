import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import "./tableGathering.css";
import {
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdOutlineDelete,
} from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import PopupOptions from "../popup/Popup";
import ViewGathering from "../viewPopup/ViewGathering";
import FormGatheringModal from "../formModal/FormGatheringModal";

const TableGathering = ({
  name,
  isFiltering,
  dataGathering,
  currentGathering,
}) => {
  const getStrings = (s) =>
    s != null ? (s?.length > 28 ? s?.substr(0, 24) + "..." : s) : "";
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);

  // remove item
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (gatheringId) => {
      setLoading(true);
      await makeRequest
        .post(
          `/manager/delete-gathering?gatheringId=${gatheringId}`,
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
      queryClient.invalidateQueries({ queryKey: ["gatherings"] });
    },
  });

  const handleRemoveItem = async (gatheringId) => {
    await mutation.mutateAsync(gatheringId);
  };

  const [openPopupDelete, setOpenPopupDelete] = useState(false);
  const [idItemDelete, setIdItemDelete] = useState("");

  const [openViewGathering, setOpenViewGathering] = useState(false);
  const [itemSelected, setItemSelected] = useState({});

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div class="gathering-box">
      {/* {isLoading && <Loading />} */}
      {/* table header  */}
      <div class="gathering-head">
        <div class="gathering-cell">
          <p>ID</p>
        </div>
        <div class="gathering-cell">
          <p>{name} Name</p>
        </div>
        <div class="gathering-cell">
          <p>{name} Address</p>
        </div>
        <div class="gathering-cell">
          <p>{name} leader id</p>
        </div>
        <div class="gathering-cell">
          <p></p>
        </div>
      </div>

      {/* table rows */}
      {currentGathering?.length <= 0 && isFiltering ? (
        <p>No exchange match</p>
      ) : (
        currentGathering?.map((item, index) => (
          <div class="gathering-row" key={index}>
            <div class="gathering-cell first-cell">
              <p>{getStrings(item.id)}</p>
            </div>
            <div class="gathering-cell second-cell">
              <p>{getStrings(item.exchangeName)}</p>
            </div>
            <div class="gathering-cell third-cell">
              <p>{getStrings(item.exchangeAddress)}</p>
            </div>
            <div class="gathering-cell last-cell">
              <p>{getStrings(item.exchangeLeaderId)}</p>
            </div>
            <div class="gathering-cell gathering-actions">
              <MdOutlineRemoveRedEye
                className="gathering-actions-icon add"
                onClick={() => {
                  setItemSelected(item);
                  setOpenViewGathering(true);
                }}
              />
              <MdOutlineEdit
                className="gathering-actions-icon edit"
                onClick={() => {
                  setItemSelected(item);
                  setOpenEdit(true);
                }}
              />
              <MdOutlineDelete
                className="gathering-actions-icon delete"
                onClick={() => {
                  setOpenPopupDelete(true);
                  setIdItemDelete(item.id);
                }}
              />
            </div>
          </div>
        ))
      )}
      {dataGathering?.length <= 0 ? (
        <p></p>
      ) : (
        dataGathering?.map((item, index) => (
          <div class="gathering-row" key={index}>
            <div class="gathering-cell first-cell">
              <p>{getStrings(item.id)}</p>
            </div>
            <div class="gathering-cell second-cell">
              <p>{getStrings(item.gatheringName)}</p>
            </div>
            <div class="gathering-cell third-cell">
              <p>{getStrings(item.gatheringAddress)}</p>
            </div>
            <div class="gathering-cell last-cell">
              <p>{getStrings(item.gatheringLeaderId)}</p>
            </div>
            <div class="gathering-cell gathering-actions">
              <MdOutlineRemoveRedEye
                className="gathering-actions-icon add"
                onClick={() => {
                  setItemSelected(item);
                  setOpenViewGathering(true);
                }}
              />
              <MdOutlineEdit
                className="gathering-actions-icon edit"
                onClick={() => {
                  setItemSelected(item);
                  setOpenEdit(true);
                }}
              />
              <MdOutlineDelete
                className="gathering-actions-icon delete"
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
          title="Delete gathering"
          handleAction={() => handleRemoveItem(idItemDelete)}
          loading={loading}
          setOpenPopup={setOpenPopupDelete}
        />
      )}

      {openViewGathering && (
        <ViewGathering
          item={itemSelected}
          closeVisible={() => setOpenViewGathering(false)}
        />
      )}

      {openEdit && (
        <FormGatheringModal
          item={itemSelected}
          closeFormModal={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
};

export default TableGathering;
