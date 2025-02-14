"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";

interface Passenger {
  id: number;
  name: string;
  gender: string;
  age: number;
  coachPosition: string;
  coachType: string;
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
  paymentVerified: boolean;
}

export default function TicketPage() {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [QrData, setQrData] = useState("")
  const [Pnrnumber, setPnrnumber] = useState("")
  const [transaction, settransaction] = useState("")
  const [distance, setdistance] = useState<number|null>(null)
  const router = useRouter()

  const generateDistance=()=>{
    return Math.floor(500 + Math.random()*501)
  }

  const generatePnr = () => {

    return Math.floor(1000000000 + Math.random()*9000000000).toString()
  }

  const generatetransaction =()=>{
    return Math.floor(10000000000000+Math.random()*900000000000000).toString()
  }

  useEffect(() => {
    if (bookingId) {
      fetch(`http://localhost:3001/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setTicket(data);
          setQrData(uuidv4());
          setPnrnumber(generatePnr())
          settransaction(generatetransaction())
          setdistance(generateDistance())
        })
        .catch(() => setError("Failed to fetch ticket details."));
    }
  }, [bookingId]);

  const handleprint=() => {
      window.print()
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        {error || "Loading ticket details..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-black">
      <div className="w-[70rem]  bg-white shadow-lg rounded p-6 ">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
         
         Electronic Reservation Slip(ERS)
                 </h1>

       

        {/* Train Details */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-black h-44 py-6">
          <h2 className="text-xl font-semibold text-gray-800 uppercase">
           {ticket.train.name} ({ticket.train.trainNumber})
          </h2>
          <div className="flex justify-between mt-3">
            <div className="text-gray-700 ">
              <p className="font-semibold">Departure:</p>
              <p  className=" mt-2">
                {new Date(ticket.train.departure).toLocaleString()} |{" "}
                <span className="font-bold">{ticket.train.source}</span>
              </p>
            <div className="flex flex-col justify-center items-center absolute left-[45rem] top-48 ">
            <h2 className="text-lg font-bold text-gray-800">
              Distance
            </h2>
            <span className="text-blue-900">{distance} km</span>
          </div>
          <div className="flex justify-center items-center mb-4 mt-2 mr-36">
          <h2 className="text-lg font-bold text-gray-800">
            PNR: <span className="text-blue-900">{Pnrnumber}</span>
          </h2>
        </div> 
            </div>
            <div className="text-gray-700">
              <p className="font-semibold">Arrival:</p>
              <p className=" mt-2">
                {new Date(ticket.train.arrival).toLocaleString()} |{" "}
                <span className="font-bold">{ticket.train.destination}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 underline"> Passengers Details</h3>
        <div className="gap-5">
          {ticket.passengers.map((passenger, index) => (
            <div
              key={passenger.id}
               className="grid grid-cols-5 bg-white p-4 shadow rounded-lg border border-gray-200 gap-x-7"
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
              
              <div className=" flex flex-row gap-2">

              <span className="font-bold">Coach:</span> 
              <p className="text-gray-800">
                {passenger.coachPosition}
              </p>
              </div>
              <p className="text-gray-800">
                <span className="font-bold">Type</span> {passenger.coachType}
              </p>
            </div>
          ))}
        </div>

        {/* Fare Details */}
        <div className="bg-white p-4 mt-6 rounded-lg shadow-md border border-black flex flex-col gap-2">
          <div className=" flex flex-row gap-20">

          <h3 className=" text-sm font-normal text-black">Ticket Fare:</h3>
          <p className=" text-sm font-normal text-blue-900">₹{ticket.totalFare}</p>
          </div>
          <div className=" flex flex-row gap-5">

          <h3 className="text-sm font-normal text-black">Irctc convenience fee</h3>
          <p className="text-sm font-normal text-blue-900">₹50.00</p>
          </div>

          <div className=" flex flex-row gap-16">

            <h3 className="text-sm font-normal text-black">GST Included</h3>
            <p className="text-sm font-normal text-blue-900">₹11.00</p>
          </div>

          <div className="flex justify-start items-start  mt-2 mr-36">
          <h2 className="text-lg font-bold text-gray-800 underline">
            Transaction Id: <span className="text-blue-900 underline">{transaction}</span>
          </h2>
        </div> 

          <div className=" flex flex-col items-end justify-end -mt-28">
          {/* <h3 className=" font-semibold text-gray-800 mb-2">Scan This Code To See Details</h3> */}
          <QRCodeCanvas value={QrData} size={250} />
        </div>
{/* 
          <div className=" -mt-24">
            <p className=" text-black font-bold text-sm">Beware of the fraudulent customer care number use oly irctc e-ticketing website for booking tickets</p>
          </div> */}

          <div className=" flex flex-col text-black font-normal w-1/2  gap-3 -mt-20">
            <h3 className="text-sm"> 1 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda .</h3>
            <h3 className="text-sm"> 2 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda suscipit voluptatibus </h3>            
            <h3 className="text-sm"> 3 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus </h3>            
            <h3 className="text-sm"> 4 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda suscipit </h3>            
            <h3 className="text-sm"> 5 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda suscipit voluptatibus eligendi .</h3>            
            <h3 className="text-sm"> 6 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda suscipit voluptatibus eligendi enim exercitationem</h3>            
            <h3 className="text-sm"> 7 .Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere sequi, est officia praesentium alias soluta possimus voluptatem ipsa! Officiis recusandae expedita vitae corrupti, pariatur et doloribus suscipit? Blanditiis quo ea corporis mollitia explicabo ducimus assumenda suscipit voluptatibus eligendi enim exercitationem beatae cum vel</h3>                                         

          </div>





        </div>


      </div>
      {!ticket.paymentVerified ? (
          <button
            onClick={() => router.push(`/payment/${bookingId}`)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition mt-5"
          >
            Confirm Payment
          </button>
        ) : (
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mt-5"
          >
            Print Ticket
          </button>
        )}
    </div>
  );
}
