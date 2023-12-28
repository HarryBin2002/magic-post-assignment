export const handleCloseOptions = (setOpenOptions) => {
  document.body.style.overflow = "visible";
  setOpenOptions(false);
};

export const handleOpenOptions = (
  setOpenOptions,
  username,
  modelId,
  setOwnModel,
  setIsModelId
) => {
  document.body.style.overflow = "hidden";
  setOpenOptions(true);
  if (username) setOwnModel(username);
  if (modelId) setIsModelId(modelId);
};
