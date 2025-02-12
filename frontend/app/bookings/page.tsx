"use client";

import { useState } from "react";

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
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchTrains = async () => {
    if (!destination.trim()) {
      setError("Please enter a valid destination.");
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Book a Train</h1>

      {/* Search Input */}
      <div className="w-full max-w-md flex flex-col items-center">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter Destination"
          className="border p-2 rounded w-full mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        
        <button
          onClick={searchTrains}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
        >
          Search Trains
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500 mt-4">Searching trains...</p>}

      {/* Trains List */}
      <div className="w-[90rem] mt-6 space-y-6">
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
          </div>
        ))}
      </div>
    </div>
  );
}
