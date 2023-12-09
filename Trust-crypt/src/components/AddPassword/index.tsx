import ModalComponent from "../Modal";
// import { execute_raw_transaction } from "../../hooks/useOkto";

const Index = ({ value, wallet }) => {
  const [isModalOpen, setModalOpen] = value;
  const handleAddPassword = () => {
    console.log("wallet", wallet);

    // execute_raw_transaction(
    //     import.meta.env.VITE_OKTO_API_KEY,
    //   auth,
    //   network_name,
    //   from,
    //   to,
    //   tx_data,
    //   value
    // );
  };
  return (
    <ModalComponent value={[isModalOpen, setModalOpen]}>
      <div className="w-60 h-30">
        <h1 className="text-2xl">Add Password</h1>
        <div className="py-5">
          {" "}
          Site:
          <input
            className=" px-3 border-black"
            type="text"
            placeholder="Site Name"
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input className=" px-3" type="text" placeholder="username" />
        </div>
        <div className="py-5">
          {" "}
          Password :
          <input className=" px-3" type="text" placeholder="Password" />
        </div>
      </div>
      <div className="w-full">
        <button
          onClick={() => setModalOpen(false)}
          className="p-2 rounded-xl text-left float-left bg-red-500"
        >
          cancel
        </button>
        <button
          onClick={handleAddPassword}
          className=" float-right text-right bg-green-500 p-2 rounded-xl"
        >
          Add
        </button>
      </div>
    </ModalComponent>
  );
};

export default Index;
