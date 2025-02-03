"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import Link from "next/link";

function History() {
  const [name, setName] = useState<string>("undefind");
  const [email, setEmail] = useState<string>("undefind@gmail.com");
  const [statistics, setstatistics] = useState<{
    perWeek: number;
    currentweek: number;
    perMouth: number;
    total: number;
  }>({
    perWeek: 999,
    currentweek: 0,
    perMouth: 999,
    total: 999,
  });

  const dateToDay = DateTime.now()
    .setZone("Asia/Bangkok")
    .toFormat("dd MMM yyyy");

  const color: Readonly<{ color1: string; color2: string; color3: string }> = {
    color1: "#000000",
    color2: "#f4f4f4",
    color3: "#f4f4f4",
  };

  return (
    <div className="font-kanit">
      <nav className="rounded-lg flex justify-between items-center mt-6 mx-[25px] md:mx-[70px]">
        <div className="flex items-center gap-x-4">
          <Image
            src="/logo.png"
            width={200}
            quality={100}
            height={200}
            className="w-12 h-12 sm:w-14 sm:h-14"
            alt="logo"
          ></Image>
          <div className="hidden md:block">
            <h2 className="text-[1.11em]">มหาวิทยาลัยขอนแก่น</h2>
            <p className="text-[#4A4A4A] text-[0.6em]">
              กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
            </p>
          </div>
        </div>
        <div className="flex text-[12px] hover:text-[#4A4A4A] items-center transition-all duration-[500ms] gap-x-[25px]">
          <ul className="sm:block hidden">รายละเอียด</ul>
          <ul className="sm:block hidden">วิธีการใช้งาน</ul>
          <ul>ติดต่อ</ul>
          <ul
            style={{ backgroundColor: color.color1 }}
            className=" text-white rounded-[25px] py-[10px] px-6"
          >
            <Link href={"/submit"}>เช็คชื่อ</Link>
          </ul>
        </div>
      </nav>
      <section className="flex mt-8  justify-between gap-x-10 mx-[25px] sm:mx-[70px]">
        <div>
          <h2 className="text-[0.78em] sm:text-[0.9em]">สถิติการรดน้ำต้นไม้</h2>
          <p className="text-[#4A4A4A]  text-[0.6em] sm:text-[0.74em] font-[300]">
            ตารางตรวจสอบรายละเอียด และติดตามการดน้ำต้นไม้ของคุณ
          </p>
        </div>
        <div className="flex items-center gap-x-8">
          <div
            style={{ backgroundColor: color.color3 }}
            className="hidden lg:flex rounded-lg px-4 py-2 items-center gap-x-2"
          >
            <Image
              src="/calendar.svg"
              width={18}
              height={18}
              alt="calendar"
            ></Image>
            <h2 className="text-[0.8em]">{dateToDay}</h2>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-gray-400"></div>
            <div>
              <h2 className="text-[0.78em] sm:text-[0.85em]">{name}</h2>
              <p className="font-[300] text-[#4a4a4a] text-[0.6em] sm:text-[0.68em]">
                {email}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-2 mx-[25px] sm:mx-[70px]">
        <div className="border-2 rounded-lg py-4 px-6">
          <div className="flex items-center justify-between  gap-x-2">
            <div className="flex items-center gap-x-2">
              <Image
                src="/money.svg"
                height={16}
                width={16}
                alt="money"
              ></Image>
              <h2 className="text-[0.85em]">รายได้ต่อสัปดาห์</h2>
            </div>
            <Image
              src="/refesh.svg"
              height={26}
              width={26}
              alt="refesh"
            ></Image>
          </div>
          <hr className="mt-2" />
          <div className="mt-2 gap-x-2 flex items-end">
            <h1 className="text-[1.5em] md:text-[1.6em]">
              {statistics.perWeek.toFixed(2)}
            </h1>
            <p className="translate-y-[-4px] md:translate-y-[-4px]">บาท</p>
          </div>
          <p className="text-[0.6em] md:text-[0.7em] mt-2 text-[#4a4a4a]">
            รายได้จะถูกจำกัดหากรายได้ต่อเดือนถึงจำนวนจำกัดแล้ว
          </p>
        </div>
        <div className="border-2 rounded-lg py-4 px-6">
          <div className="flex items-center justify-between  gap-x-2">
            <div className="flex gap-x-2 items-center gap-x-2">
              <Image
                src="/water.svg"
                height={16}
                width={16}
                alt="money"
              ></Image>
              <h2 className="text-[0.85em]">จำนวนครั้งที่รดในสัปดาห์นี้</h2>
            </div>
            <Image
              src="/refesh.svg"
              height={26}
              width={26}
              alt="refesh"
            ></Image>
          </div>
          <hr className="mt-2" />
          <div className="mt-2 gap-x-2 flex items-end">
            <h1 className="text-[1.5em] md:text-[1.6em]">
              {statistics.currentweek}
            </h1>
            <p className="translate-y-[-4px] md:translate-y-[-4px]">ครั้ง</p>
          </div>
          <p className="text-[0.6em] md:text-[0.7em] mt-2 text-[#4a4a4a]">
            ต้องรดน้ำให้มากว่าข้อกำหนดถึงจะได้รับเงิน
          </p>
        </div>
        <div className="border-2 rounded-lg py-4 px-6">
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <Image src="/pay.svg" height={16} width={16} alt="money"></Image>
              <h2 className="text-[0.85em]">รายได้ภายในเดือน</h2>
            </div>
            <Image
              src="/refesh.svg"
              height={26}
              width={26}
              alt="refesh"
            ></Image>
          </div>
          <hr className="mt-2" />
          <div className="mt-2 gap-x-2 flex items-end">
            <h1 className="text-[1.5em] md:text-[1.6em]">
              {statistics.perMouth.toFixed(2)}
            </h1>
            <p className="translate-y-[-4px] md:translate-y-[-4px]">บาท</p>
          </div>
          <p className="text-[0.6em] md:text-[0.7em] mt-2 text-[#4a4a4a]">
            ในเดือนนี้คุณจะยังได้รับเงินได้อีก{" "}
            <span style={{ color: color.color2 }}>
              {3000 - statistics.perMouth}
            </span>{" "}
            บาท
          </p>
        </div>
        <div className="border-2 rounded-lg py-4 px-6">
          <div className="flex items-center justify-between  gap-x-2">
            <div className="flex items-center gap-x-2">
              <Image
                src="/wallet.svg"
                height={16}
                width={16}
                alt="money"
              ></Image>
              <h2 className="text-[0.85em]">รายได้ทั้งหมด</h2>
            </div>
            <Image
              src="/refesh.svg"
              height={26}
              width={26}
              alt="refesh"
            ></Image>
          </div>
          <hr className="mt-2" />
          <div className="mt-2 gap-x-2 flex items-end">
            <h1 className="text-[1.5em] md:text-[1.6em]">
              {statistics.total.toFixed(2)}
            </h1>
            <p className="translate-y-[-4px] md:translate-y-[-4px]">บาท</p>
          </div>
          <p className="text-[0.6em] md:text-[0.7em] mt-2 text-[#4a4a4a]">
            รายได้ทั้งหมดตั้งแต่เริ่มโครงการ
          </p>
        </div>
      </section>
      <section className="mt-10 bg-[#F7F8FB] pt-12 px-[25px] md:px-[70px]">
        {" "}
        <div className="bg-white min-h-[300px] rounded-t-[35px] px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2>ประวัติการรดน้ำต้นไม้</h2>
              <p className="text-[#4a4a4a] font-[300] text-[0.8em]">
                ตรวจสอบการเช็คชื่อย้อนหลัง และค่าสถิติต่างๆ
                ที่เกี่ยวข้องทั้งหมดได้ที่นี่
              </p>
            </div>
            <Image
              title="report"
              src="/report.svg"
              height={38}
              width={38}
              alt="refesh"
            ></Image>
          </div>
          <div className="w-full mt-6 ">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[0.85em] text-[#4a4a4a]">
                  <th className="w-1/12 py-2 px-4 font-normal">ID</th>
                  <th className="hidden sm:table-cell w-1/12 py-2 px-4 font-normal">
                    ผู้ส่ง
                  </th>
                  <th className="w-1/12 py-2 px-4 font-normal">วันที่</th>
                  <th className="hidden sm:table-cell w-1/12 py-2 px-4 font-normal">
                    เวลา
                  </th>
                  <th className=" w-1/12 py-2 px-4 font-normal">สถานะ</th>
                  <th className="w-1/12 py-2 px-4 font-normal">สะสม</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div></div>
      </section>
    </div>
  );
}

export default History;
