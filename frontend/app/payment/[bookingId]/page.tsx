"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "phonepe">("card");
  const [email, setEmail] = useState("");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handlePayment = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          email,
          paymentMethod,
          cardDetails: paymentMethod === "card" ? cardDetails : null, // Send only for card payments
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Payment verification email sent. Please check your inbox.");
        router.push(`/ticket/${bookingId}`);
      } else {
        alert(data.message || "Payment failed.");
      }
    } catch (error) {
      alert("Error processing payment.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-black">
      <div className="w-[40rem] bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Select Payment Method
        </h1>

        {/* Payment Method Selection */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-lg text-white ${
              paymentMethod === "card" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            Pay with Card
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white ${
              paymentMethod === "phonepe" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setPaymentMethod("phonepe")}
          >
            Pay with PhonePe
          </button>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {/* PhonePe QR Code */}
        {paymentMethod === "phonepe" && (
          <div className="flex flex-col items-center mt-4">
            <QRCodeCanvas value={`upi://pay?pa=your-upi-id@upi&pn=TrainBooking&am=500`} size={150} />
            <p className="mt-2 text-gray-700">Scan to Pay with PhonePe</p>
          </div>
        )}

        {/* Email Input */}
        <div className="mt-6">
          <input
            type="email"
            placeholder="Enter your email for verification"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400"
          />
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
