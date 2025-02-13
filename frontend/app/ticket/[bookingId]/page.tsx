"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Passenger {
  id: number;
  name: string;
  gender: string;
  age: number;
  email: string;
  phone: string;
}

interface Train {
  name: string;
  trainNumber: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
}

interface Booking {
  id: number;
  totalFare: number;
  train: Train;
  passengers: Passenger[];
}

export default function TicketPage() {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId) {
      fetch(`http://localhost:3001/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => setTicket(data))
        .catch(() => setError("Failed to fetch ticket details."));
    }
  }, [bookingId]);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        {error || "Loading ticket details..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-black">
      <div className="w-[80rem]  bg-white shadow-lg rounded p-6 ">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
         
         Electronic Reservation Slip(ERS)
                 </h1>

        {/* Train Details */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-black">
          <h2 className="text-xl font-semibold text-gray-800 uppercase">
           {ticket.train.name} ({ticket.train.trainNumber})
          </h2>
          <div className="flex justify-between mt-3">
            <div className="text-gray-700">
              <p className="font-semibold">Departure:</p>
              <p>
                {new Date(ticket.train.departure).toLocaleString()} |{" "}
                <span className="font-bold">{ticket.train.source}</span>
              </p>
            </div>
            <div className="text-gray-700">
              <p className="font-semibold">Arrival:</p>
              <p>
                {new Date(ticket.train.arrival).toLocaleString()} |{" "}
                <span className="font-bold">{ticket.train.destination}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 underline"> Passengers Details</h3>
        <div className="space-y-3">
          {ticket.passengers.map((passenger, index) => (
            <div
              key={passenger.id}
              className="flex flex-col md:flex-row justify-between bg-white p-4 shadow rounded-lg border border-gray-200"
            >
              <p className="text-gray-800">
                <span className="font-bold">{index + 1}. Name:</span> {passenger.name}
              </p>
              <p className="text-gray-800">
                <span className="font-bold">Gender:</span> {passenger.gender}
              </p>
              <p className="text-gray-800">
                <span className="font-bold">Age:</span> {passenger.age}
              </p>
              <p className="text-gray-800">
                <span className="font-bold">Email:</span> {passenger.email}
              </p>
              <p className="text-gray-800">
                <span className="font-bold">Phone:</span> {passenger.phone}
              </p>
            </div>
          ))}
        </div>

        {/* Fare Details */}
        <div className="bg-white p-4 mt-6 rounded-lg shadow-md border border-black">
          <h3 className="text-lg font-semibold text-blue-800">Total Fare:</h3>
          <p className="text-2xl font-bold text-blue-900">₹{ticket.totalFare}</p>
        </div>
      </div>
    </div>
  );
}
