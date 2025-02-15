"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TrainClass {
  id: number;
  type: string;
  price: number;
}

interface Train {
  id: number;
  name: string;
  trainNumber: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  trainClasses?: TrainClass[];
}

export default function BookTrain() {
  const [destination, setDestination] = useState("");
  const [source, setSource] = useState("");
  const [quota, setquota] = useState("GENERAL")
  const [date, setDate] = useState("");
  const [trainClass, setTrainClass] = useState("All Classes");
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [checkboxes, setCheckboxes] = useState({
    disability: false,
    flexibleDate: false,
    availableBerth: false,
  });

  const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>)  => {

    setCheckboxes({
      ...checkboxes,
      [e.target.value]:e.target.checked
    })
  }

  const searchTrains = async () => {
    if (!source.trim() || !destination.trim()){
      setError("Please enter all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3001/trains/find?destination=${destination}`);
      
      if (!res.ok) throw new Error("Failed to fetch trains");

      const data = await res.json();
      setTrains(data);
    } catch (err) {
      setError("Could not fetch trains. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold  mb-6  absolute top-10 font-mono text-blue-900">BOOK TICKET</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl h-[30rem] flex flex-row gap-4">

        <div className="flex flex-col gap-4 mb-4 w-1/2 mt-16">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="From"
            className="border p-2 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950  border-blue-900"
          />

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="To"
            className="border p-2 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950 mt-3 border-blue-900"
          />

          
          <select
            value={quota}
            onChange={(e) => setquota(e.target.value)}
            className="border p-2 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950 mt-3  border-blue-900 "
          >
            <option>GENERAL</option>
            <option>LADIES</option>
            <option>LOWER BERTH/SR CITIZEN</option>
            <option>PERSON WITH DISABILITY</option>
            <option>DUTY PASS</option>
            <option>TATKAL</option>
            <option>PREMIUM TATKAL</option>
          </select>

          {/* <div className="flex flex-col gap-2 mb-4 mt-2 text-blue-950">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="disability" checked={checkboxes.disability} onChange={handleCheckboxChange} />
            Person with Disabilities
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="flexibleDate" checked={checkboxes.flexibleDate} onChange={handleCheckboxChange} />
            Flexible with Date
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="availableBerth" checked={checkboxes.availableBerth} onChange={handleCheckboxChange} />
            Train with Available Berth
          </label>
        </div> */}
        </div>



        <div className="flex flex-col gap-4 mb-4 w-1/2 mt-16">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950 border-blue-900"
          />
          <select
            value={trainClass}
            onChange={(e) => setTrainClass(e.target.value)}
            className="border p-2 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950 border-blue-900 mt-2"
          >
            <option>All Classes</option>
            <option>Executive Chair Car (EC)</option>
            <option>AC 3 Tier </option>
            <option>AC 2 Tier</option>
            <option>AC First</option>
            <option>Visatdome Chair Car (VC)</option>
            <option>AC Chair Car (CC)</option>
            <option>Second Sitting (2S)</option>
            <option>AC 3 Economy</option>
            <option>Sleeper</option>



          </select>
        </div>


      </div>

      <div className=" -mt-36  flex  items-start justify-start  left-0">


      <button
          onClick={searchTrains}
          className="bg-blue-500 text-white  w-full  p-3 px-8 rounded  transition"
          >
          Search
        </button>
          </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p className="text-gray-500 mt-4">Searching trains...</p>}
      <div className="w-[90rem] mt-36 space-y-6">
        {trains.length === 0 && !loading && !error && <p className="text-gray-600 text-center">No trains found.</p>}

        {trains.map((train) => (
          <div
            key={train.id}
            className="bg-white p-6 rounded shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            {/* Train Name & Number */}
            <div className="flex flex-row gap-3">
              <h2 className="text-2xl font-semibold text-black uppercase">{train.name}</h2>
              <p className="text-gray-600 text-lg">
                <span className="font-bold">({train.trainNumber})</span>
              </p>
            </div>

            {/* Departure & Arrival */}
            <div className="flex flex-row items-center justify-between gap-10 mt-3 w-full">
              {/* Departure */}
              <div className="flex flex-col items-start gap-1">
                <p className="text-gray-700 text-lg flex items-center gap-2">
                  <span className="text-gray-700 text-lg">
                    <strong>{new Date(train.departure).toLocaleString()}</strong>
                  </span>
                  <span className="font-medium text-blue-950 uppercase">| {train.source}</span>
                </p>
              </div>

              {/* Arrival */}
              <div className="flex flex-col items-start gap-1">
                <p className="text-gray-700 text-lg flex items-center gap-2">
                  <span className="text-gray-700 text-lg">
                    <strong>{new Date(train.arrival).toLocaleString()}</strong>
                  </span>
                  <span className="font-medium text-blue-950 uppercase">| {train.destination}</span>
                </p>
              </div>
            </div>

            {/* Train Classes */}
            {train.trainClasses && train.trainClasses.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Classes:</h3>
                <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
                  {train.trainClasses
                    .filter((value, index, self) => self.findIndex(t => t.type === value.type) === index)
                    .map((trainClass) => (
                      <li
                        key={trainClass.id}
                        className="flex flex-col items-center justify-center p-4 w-44 h-24 bg-gray-100 rounded-lg shadow-md"
                      >
                        <span className="font-medium text-gray-800 text-lg">{trainClass.type}</span>
                        <span className="text-green-600 font-bold text-md">₹{trainClass.price}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Book Button - Now inside the train card */}
            <button
              onClick={() => router.push(`/bookticket?trainId=${train.id}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
