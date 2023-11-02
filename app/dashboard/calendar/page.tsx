import CalendarClient from "./components/client";

const page = async () => {
  return (
    <div className="flex  w-full h-screen overflow-hidden p-4">
      <div className="flex flex-col w-full max-h-[calc(100vh-4rem)] overflow-auto">
        <CalendarClient />
      </div>
    </div>
  );
};

export default page;
