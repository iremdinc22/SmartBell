import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const MAP_URL = "http://localhost:5131/maps/map.png";

const RobotsLocation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [devices] = useState([
    {
      id: "ZS-VB-001",
      name: "ValetBot-01",
      status: "Online",
      color: "#A8F5B4",
      battery: 92,
      position: { top: "25%", left: "15%" },
    },
    {
      id: "ZS-RS-004",
      name: "RoomServiceBot-04",
      status: "In-Use",
      color: "#A1C4FD",
      battery: 78,
      position: { top: "10%", left: "50%" },
    },
    {
      id: "ZS-CU-007",
      name: "CleaningUnit-07",
      status: "Online",
      color: "#A8F5B4",
      battery: 85,
      position: { top: "70%", left: "60%" },
    },
    {
      id: "ZS-LB-002",
      name: "LuggageBot-02",
      status: "Offline",
      color: "#F4B3B1",
      battery: 0,
      position: { top: "80%", left: "20%" },
    },
    {
      id: "ZS-CB-001",
      name: "ConciergeBot-01",
      status: "In-Use",
      color: "#A1C4FD",
      battery: 91,
      position: { top: "20%", left: "75%" },
    },
  ]);

  const filteredDevices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter((d) =>
      `${d.name} ${d.id}`.toLowerCase().includes(q)
    );
  }, [devices, searchQuery]);

  return (
    <div className="flex h-screen w-full flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-white hover:text-gray-300">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-white text-3xl font-serif tracking-wider">
            Zenith Suites
          </h1>
        </div>

        <h2 className="text-lg font-medium text-white/80">Device Map</h2>

        <div className="flex flex-1 justify-end">
          <Link
            to="/admin/login"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-white/10 bg-gray-900">
          <div className="border-b border-white/10 p-4">
            <div className="flex w-full items-stretch rounded-lg h-11 bg-white/5">
              <div className="text-white/60 flex items-center justify-center pl-3">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="flex w-full rounded-r-lg text-white bg-transparent h-full placeholder:text-white/40 px-2 text-base focus:outline-0"
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Device List */}
          <div className="flex-1 overflow-y-auto">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between border-b border-white/10 cursor-pointer hover:bg-white/5 ${
                  selectedDevice?.id === device.id ? "bg-white/5" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <div className="flex flex-col">
                    <p className="text-white text-base font-medium">
                      {device.name}
                    </p>
                    <p className="text-white/50 text-sm">ID: {device.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map View */}
        <main className="flex-1 bg-[#181818] relative flex items-center justify-center p-8">
          <div className="w-full h-full border border-white/10 rounded-lg relative overflow-hidden">
            <img
              src={`${MAP_URL}?t=${Date.now()}`}
              alt="Hotel Map"
              className="absolute inset-0 w-full h-full object-contain opacity-95"
              draggable={false}
            />

            <div className="absolute inset-0">
              {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className="absolute group cursor-pointer"
                  style={device.position}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div
                    className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-900 shadow-lg"
                    style={{ backgroundColor: device.color }}
                  >
                    🤖
                  </div>

                  <div className="absolute bottom-full mb-3 w-48 -translate-x-1/2 left-1/2 p-3 rounded-lg bg-black/80 text-white text-sm opacity-0 group-hover:opacity-100">
                    <p className="font-bold">{device.name}</p>
                    <p className="text-white/70">ID: {device.id}</p>
                    <p className="text-white/70">
                      Battery: {device.battery > 0 ? `${device.battery}%` : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RobotsLocation;
