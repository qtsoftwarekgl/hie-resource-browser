import "./loadBox.css";
const LoaderComponent = (props) => {
  const { id } = props;
  return (
    <>
      <div className={`modal ${id ? "modal-open" : ""}`}>
        <div className="modal-box modal-box1">
        <h3 className="font-bold text-lg">Loading...</h3>
          <div className="info-container info-container1">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoaderComponent;
