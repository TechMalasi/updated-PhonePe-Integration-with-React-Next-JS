"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import sha256 from "crypto-js/sha256";
import { redirect } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const Pay = () => {

    const router = useRouter();

    const  [data,setData] =useState();

  const handleFormData = (e) => {
    // console.log(e.target.value);
    const dd = { ...data, [e.target.name]: e.target.value };
    setData(dd);
  };


  const makePayment=async(e)=>{

    e.preventDefault();

    const transactionid = "Tr-"+uuidv4().toString(36).slice(-6);

    const payload = {
        merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
        merchantTransactionId: transactionid,
        merchantUserId: 'MUID-'+uuidv4().toString(36).slice(-6),
        amount: 10000,
        redirectUrl: `http://localhost:3000/api/status/${transactionid}`,
        redirectMode: "POST",
        callbackUrl: `http://localhost:3000/api/status/${transactionid}`,
        mobileNumber: '9999999999',
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };


      const dataPayload = JSON.stringify(payload);
      console.log(dataPayload);

      const dataBase64 = Buffer.from(dataPayload).toString("base64");
      console.log(dataBase64);


  const fullURL =
        dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
     const dataSha256 = sha256(fullURL);

      const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
      console.log("c====",checksum);



    const UAT_PAY_API_URL =
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";


  const response = await axios.post(
    UAT_PAY_API_URL,
    {
      request: dataBase64,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
         "X-VERIFY": checksum,
      },
    }
  );


  const redirect=response.data.data.instrumentResponse.redirectInfo.url;
  router.push(redirect)


  }


  return (
       <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              value="DemoTest"
              onChange={(e) => handleFormData(e)}
              type="name"
              autoComplete="name"
              required=""
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="Mobile"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Mobile
          </label>
          <div className="mt-2">
            <input
              id="Mobile"
              name="mobile"
              value="999999999"
              onChange={(e) => handleFormData(e)}
              autoComplete="Mobile"
              required=""
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="Amount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Amount
          </label>
          <div className="mt-2">
            <input
              id="Amount"
              name="amount"
              value="10"
              autoComplete="Amount"
              onChange={(e) => handleFormData(e)}
              required=""
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="MUID"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            MUID
          </label>
          <div className="mt-2">
            <input
              id="MUID"
              name="muid"
              value="nuid-909090"
              onChange={(e) => handleFormData(e)}
              autoComplete="MUID"
              required=""
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div></div>
        <div>
          <button
            onClick={(e) => makePayment(e)}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Pay
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Pay