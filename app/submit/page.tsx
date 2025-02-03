"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { parse } from "exifr";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

interface FilePreview {
  file: File;
  preview: string;
}

interface ExifData {
  DateTimeOriginal?: string;
  Make?: string;
  Model?: string;
  GPSLatitude?: number;
  GPSLongitude?: number;
}

interface ExifOptions {
  pick?: string[];
}

const ImageUploadPage = () => {
  const [showstatement, setShowstatement] = useState<boolean>(true);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [exifDateTime, setExifDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [error, setError] = useState<string>("");
  const [distanceFromGoal, setDistanceFromGoal] = useState<number>();
  const [location, setLocation] = useState<any>();
  const [user, setUser] = useState<{
    name: string;
    fileName: string | undefined;
    id: string;
    datePhoto: string | undefined;
    timePhoto: string | undefined;
    dateSubmit: string;
    timeSubmit: String;
    distance: number | undefined;
  }>();

  function toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    const R = 6371000;
    const lat1Rad = toRadians(lat1);
    const lng1Rad = toRadians(lng1);
    const lat2Rad = toRadians(lat2);
    const lng2Rad = toRadians(lng2);

    const deltaLat = lat2Rad - lat1Rad;
    const deltaLng = lng2Rad - lng1Rad;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    setDistanceFromGoal(distance);
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");

      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("Location access denied. Please allow access.");
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      calculateDistance(
        location?.latitude,
        location?.longitude,
        16.476280555555554,
        102.82562222222222
      );
    }
  }, [location]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!filePreview) {
      setError("Please provide information");
      return;
    }
    if (!exifDateTime) {
      setError("อุปกรณ์และแหล่งที่มารูปภาพไม่ตรงกัน");
      return;
    }
    const now = DateTime.now().setZone("Asia/Bangkok");
    const timeSubmit = now.toFormat("HH:mm:ss");
    const datesubmit = now.toFormat("HH:mm:ss");
    const buddhistEraDate = now.plus({ years: 543 }).toFormat("dd/MM/yyyy");
    const id = uuid();
    const data = {
      name: "สมชาย มั่นหมาย",
      fileName: filePreview?.file.name,
      id: id,
      datePhoto: exifDateTime?.date,
      timePhoto: exifDateTime?.time,
      dateSubmit: buddhistEraDate,
      timeSubmit: timeSubmit,
      distance: distanceFromGoal,
    };
    setUser(data);
    console.log(data);
    setShowstatement(false);
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) {
        console.log("not recipe file ");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      const options = {
        pick: ["DateTimeOriginal"],
      };

      const exifData = await parse(file, options);

      setFilePreview({ file, preview: previewUrl });
      if (exifData && exifData.DateTimeOriginal) {
        const dateTimeOriginal = new Date(exifData.DateTimeOriginal);
        const date = dateTimeOriginal.toLocaleDateString("th-TH", {
          timeZone: "Asia/Bangkok",
        });
        const time = dateTimeOriginal.toLocaleTimeString("th-TH", {
          timeZone: "Asia/Bangkok",
        });

        setExifDateTime({ date: date, time: time });
        setError("");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = (): void => {
    if (filePreview?.preview) {
      URL.revokeObjectURL(filePreview.preview);
    }
    setFilePreview(null);
    setExifDateTime(null);
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: handleDrop,
  });

  return (
    <div className="font-kanit mb-16">
      {distanceFromGoal ? (
        <div>
          {showstatement ? (
            <div>
              {" "}
              <div className="flex justify-center mt-[70px]">
                <div className="flex items-center gap-x-4">
                  <Image
                    src="/logo.png"
                    width={200}
                    quality={100}
                    height={200}
                    className="w-12 h-12 sm:w-16 sm:h-16"
                    alt="logo"
                  />
                  <div className="">
                    <h2 className="text-[1.11em]">มหาวิทยาลัยขอนแก่น</h2>
                    <p className="text-[#4A4A4A] text-[0.6em]">
                      กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
                    </p>
                  </div>
                </div>
              </div>
              <form>
                <div className="max-w-[600px] mx-auto px-[50px] mt-10">
                  <h2 className="md:text-[1em] text-[0.8em]">อัพโหลดไฟล์</h2>
                  {!filePreview ? (
                    <div
                      {...getRootProps()}
                      style={{
                        border: "2px dashed #959595",
                        borderSpacing: "4px",
                      }}
                      className="mt-4 rounded-lg p-8"
                    >
                      <Image
                        src="/add.svg"
                        width={200}
                        quality={100}
                        height={200}
                        className="w-12 mx-auto h-12 sm:w-12 sm:h-12"
                        alt="logo"
                      />
                      <h2 className="text-center font-[300] mt-4 text-[#4a4a4a] text-[0.85em] mx-[50px]">
                        ภาพที่อัพโหลดต้องเป็นภาพที่มาจากอุปกรณ์ที่อัพโหลดเท่านั้น
                      </h2>

                      <div className="flex items-center mx-auto gap-x-2 justify-center mt-4">
                        <Image
                          src="/caution.svg"
                          width={200}
                          quality={100}
                          height={200}
                          className="w-4 h-4 sm:w-4 sm:h-4"
                          alt="logo"
                        />
                        <p className="text-[0.7em] text-[#363636]">
                          ขนาดของไฟล์จะต้องไม่เกิน 10 mb
                        </p>
                      </div>
                      <input {...getInputProps()} />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <img src={filePreview.preview} alt="preview" />
                    </div>
                  )}
                  {filePreview && (
                    <div className="mt-4 border-2 flex gap-x-2 items-center p-4 justify-between rounded-lg">
                      <div className="flex items-center gap-x-2">
                        <Image
                          src="/fileimg.svg"
                          width={200}
                          quality={100}
                          height={200}
                          className="w-4 h-4 sm:w-4 sm:h-4 invert-[0.2]"
                          alt="logo"
                        />
                        <p>{filePreview?.file.name.length<17? filePreview?.file.name:filePreview?.file.name.substring(0,17)+"..."}</p>
                      </div>
                      <Image
                        onClick={handleDelete}
                        src="/trash.svg"
                        width={200}
                        quality={100}
                        height={200}
                        className="w-4 h-4 sm:w-4 sm:h-4 invert-[0.2]"
                        alt="logo"
                      />
                    </div>
                  )}
                  <button
                    onClick={(e) => handleSubmit(e)}
                    type="submit"
                    disabled={filePreview ? false : true}
                    style={{
                      backgroundColor: filePreview ? "black" : "#858585",
                    }}
                    className="py-4 px-6 text-white rounded-lg mt-4 w-full"
                  >
                    ส่งรูปภาพ
                  </button>
                  <p className="mt-4 text-[0.8em] text-[#4a4a4a] font-[300]">
                    เช็คชื่อเสร็จแล้ว อยากดูสถิติที่ผ่านมา?
                    <span className="text-black font-[400]">
                      <Link href={"/"}> กดตรงนี้</Link>
                    </span>
                  </p>
                  <p className="text-red-400 text-[0.8em]">{error}</p>
                </div>
              </form>
            </div>
          ) : (
            <div className="max-w-[600px] p-[30px] mx-auto">
              <Image
                onClick={handleDelete}
                src="/check.svg"
                width={200}
                quality={100}
                height={200}
                className="mt-12 mx-auto w-24 h-24 sm:w-28 sm:h-28"
                alt="logo"
              />
              <h2 className="text-[1.5em] text-center mt-8">
                เสร็จสิ้นการเช็คชื่อ
              </h2>
              <p className="text-center text-[0.85em] font-[300]  text-[#a4a4a4]">
                โปรดตรวจสอบข้อมูลย้อนหลังเพื่อความเรียบร้อย
              </p>

              <div className=" p-6 mt-10 rounded-lg flex flex-col gap-y-[15px] border-2">
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em]  text-[#a4a4a4]">Id</h2>
                  <h2 className="text-[1em] text-center  grow max-w-[150px]">
                    {user?.id.substring(0, 8)} ...
                  </h2>
                </div>{" "}
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em] text-[#a4a4a4]">ผู้ส่ง</h2>
                  <h2 className="text-[1em] text-center  grow max-w-[150px]">
                    {user?.name}
                  </h2>
                </div>{" "}
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em] text-[#a4a4a4]">วันที่ส่ง</h2>
                  <h2 className="text-[1em] text-center  grow max-w-[150px]">
                    {user?.dateSubmit}
                  </h2>
                </div>{" "}
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em] text-[#a4a4a4]">เวลาที่ส่ง</h2>
                  <h2 className="text-[1em] text-center  grow max-w-[150px]">
                    {user?.timeSubmit}
                  </h2>
                </div>
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em] text-[#a4a4a4]">
                    จำนวนครั้งในสัปดาห์นี้
                  </h2>
                  <h2 className="text-[1em] text-center  grow max-w-[150px]">
                    0
                  </h2>
                </div>
                <div className="flex justify-between font-[300]">
                  <h2 className="text-[1em] text-[#a4a4a4]">สถานะ</h2>
                  <h2 className="text-[0.7em] text-center  grow max-w-[150px] ">
                    <span className="text-[#8BC374] bg-[#E0F7DA] rounded-lg px-4 py-2">
                      เสร็จสิ้น
                    </span>
                  </h2>
                </div>
              </div>
              <Link href={"/"}>
                <button className="mt-4 rounded-lg py-2 bg-black text-white w-full border-2">
                  เช็คประวัติ
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-[600px] mx-auto">
          <Image
            src="/404.svg"
            width={200}
            quality={100}
            height={200}
            className="mt-12 mx-auto w-60 h-60 sm:w-72 sm:h-72"
            alt="logo"
          />
          <h2 className="text-center text-[1.3em]">
            ไม่สามารถเข้าถึง GPS บนเครื่องได้
          </h2>
          <p className="text-center text-[#4a4a4a] font-[300] text-[0.9em] mt-2">
            โปรดปฏิบัติตามคู่มือด้านล่าง หรือติดต่อผู้ดูแล
          </p>
          <div className="text-center mt-[100px] text-[0.8em]">
            <Image
              src="/connect02.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-44 "
              alt="logo"
            />
            <p className="mt-4">1.สำหรับ andriod กดที่จุดสามจุดด้านขวาบน</p>
          </div>
          <div className="text-center text-[0.8em]">
            <Image
              src="/connect01.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-44 "
              alt="logo"
            />
            <p className="mt-4">
              2.คลิ๊กไอคอนรูปตัว i เปิดรายละเอียดเพิ่มเติมสำหรับเว็บไซต์
            </p>
          </div>
          <div className="text-center text-[0.8em]">
            <Image
              src="/connect03.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-44 "
              alt="logo"
            />
            <p className="mt-4">
              3.เข้าไปที่การอนุญาตสิทธิ์ของเครื่อง เพื่อระบุตำแหน่งของคุณ
            </p>
          </div>
          <div className="text-center text-[0.8em]">
            <Image
              src="/connect04.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-44 "
              alt="logo"
            />
            <p className="mt-4">4.เปิดการอนุญาต จากนั้นรอประมาณ 30 วินาที</p>
          </div>
          <div className="text-center mt-[100px] text-[0.8em]">
            <Image
              src="/I01.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-[300px] "
              alt="logo"
            />
            <p className="mt-4">
              1.สำหรับ Ios เปิดเว็บไซต์ใน browser chorm <br></br>{" "}
              หากยังไม่ได้ให้เข้าไปที่การตั้งค่า จากนั้นไปที่ chorm{" "}
              <br/>เข้าไปที่ location ตามรูปภาพ
            </p>
          </div>
          <div className="text-center mt-[100px] text-[0.8em]">
            <Image
              src="/I02.png"
              width={400}
              quality={100}
              height={400}
              className="mt-16 mx-auto w-[300px] "
              alt="logo"
            />
            <p className="mt-4">
             2.เปลี่ยนเป็นขณะใช้งานเว็บไซต์
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
