"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { parse } from "exifr";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { Clipboard, ClipboardCheck } from "lucide-react";

interface FilePreview {}

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

  const [showimg, setShowimg] = useState(true);
  const [showimgAfter, setShowimgAfter] = useState(true);
  const [filePreview, setFilePreview] = useState<{
    file1: File | null;
    preview1: string;
    file2: File | null;
    preview2: string;
  } | null>(null);
  const [exifDateTime, setExifDateTime] = useState<{
    date1: string;
    time1: string;
    date2: string;
    time2: string;
  } | null>(null);

  const [error, setError] = useState<string>("");
  const [distanceFromGoal, setDistanceFromGoal] = useState<number>();
  const [location, setLocation] = useState<any>();
  const [user, setUser] = useState<{
    name: string;
    fileNameAfter: string | undefined;
    fileNameBefore: string | undefined;
    id: string;
    datePhotoBefore: string | undefined;
    timePhotoBefore: string | undefined;
    datePhotoAfter: string | undefined;
    timePhotoAfter: string | undefined;
    dateSubmit: string;
    timeSubmit: string;
  }>();
  const [isCopy,setisCopy] =useState<boolean>(false);

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
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(user?.id ?? "");
      setisCopy(true);
      setTimeout(() => {
        setisCopy(false)
      }, 6000);
    } catch {
      alert("คัดลอดไม่สำเร็จ");
    }
  };
  // useEffect(() => {
  //   requestLocation();
  // }, []);

  // useEffect(() => {
  //   if (location) {
  //     calculateDistance(
  //       location?.latitude,
  //       location?.longitude,
  //       16.476280555555554,
  //       102.82562222222222
  //     );
  //   }
  // }, [location]);
  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!filePreview?.file1 || !filePreview?.file2) {
      setError("Please provide information");
      return;
    }
    if (!exifDateTime?.date1 || !exifDateTime?.date2) {
      setError("อุปกรณ์และแหล่งที่มารูปภาพไม่ตรงกัน");
      return;
    }
    const now = DateTime.now().setZone("Asia/Bangkok");
    const timeSubmit = now.toFormat("HH:mm:ss");
    const datesubmit = now.toFormat("HH:mm:ss");
    const buddhistEraDate = now.plus({ years: 543 }).toFormat("dd/MM/yyyy");
    const id = uuid();

    console.log("โหล" + exifDateTime?.date1);
    const data = {
      name: "สมชาย มั่นหมาย",
      fileNameAfter: filePreview?.file2?.name,
      fileNameBefore: filePreview?.file1?.name,
      id: id,
      datePhotoAfter: exifDateTime?.date2 ?? "",
      timePhotoAfter: exifDateTime?.time2 ?? "",
      datePhotoBefore: exifDateTime?.date1 ?? "",
      timePhotoBefore: exifDateTime?.time1 ?? "",
      dateSubmit: buddhistEraDate,
      timeSubmit: timeSubmit,
    };
    setUser(data);
    console.log(data);
    setShowstatement(false);
  };

  const handleDrop = async (acceptedFiles: File[], position: number) => {
    try {
      acceptedFiles.forEach(async (file) => {
        const previewUrl = URL.createObjectURL(file);

        const options = {
          pick: ["DateTimeOriginal"],
        };

        const exifData = await parse(file, options);

        setFilePreview((prev) => ({
          ...prev,
          file1: position === 1 ? file : prev?.file1 || null,
          preview1: position === 1 ? previewUrl : prev?.preview1 || "",
          file2: position === 2 ? file : prev?.file2 || null,
          preview2: position === 2 ? previewUrl : prev?.preview2 || "",
        }));

        if (exifData && exifData.DateTimeOriginal) {
          const dateTimeOriginal = new Date(exifData.DateTimeOriginal);
          const date = dateTimeOriginal.toLocaleDateString("th-TH", {
            timeZone: "Asia/Bangkok",
          });
          const time = dateTimeOriginal.toLocaleTimeString("th-TH", {
            timeZone: "Asia/Bangkok",
          });
          console.log(date);
          console.log(position);
          setExifDateTime((prev) => ({
            ...prev,
            date1: position === 1 ? date : prev?.date1 || "",
            time1: position === 1 ? time : prev?.time1 || "",
            date2: position === 2 ? date : prev?.date2 || "",
            time2: position === 2 ? time : prev?.time2 || "",
          }));
          setError("");
        }
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = (position: number): void => {
    if (position === 1) {
      setFilePreview((prev) =>
        prev
          ? {
              file1: null,
              preview1: "",
              file2: prev?.file2,
              preview2: prev?.preview2,
            }
          : null
      );
      setExifDateTime((prev) =>
        prev
          ? {
              date1: "",
              date2: prev?.date2 ?? "",
              time1: "",
              time2: prev?.time2 ?? "",
            }
          : null
      );
    } else {
      setExifDateTime((prev) =>
        prev
          ? {
              date2: "",
              date1: prev?.date1 ?? "",
              time2: "",
              time1: prev?.time1 ?? "",
            }
          : null
      );
      setFilePreview((prev) =>
        prev
          ? {
              file2: null,
              preview2: "",
              file1: prev?.file1,
              preview1: prev?.preview1,
            }
          : null
      );
    }

    setError("");
  };
  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      onDrop: (files) => {
        handleDrop(files, 1);
      },
    });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      onDrop: (files) => handleDrop(files, 2),
    });
  return (
    <div className="font-kanit mb-16">
      {true ? (
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
                  <div className="flex items-center justify-between">
                    <h2 className="md:text-[1em] text-[0.8em]">
                      รูปก่อนเริ่มทำงาน
                    </h2>
                    <svg
                      onClick={() => setShowimg(!showimg)}
                      className={`shrink-0 size-3.0 ${
                        showimg ? "text-blue-500" : ""
                      }`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showimg ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </>
                      )}
                    </svg>
                  </div>
                  {showimg && (
                    <div>
                      {!filePreview?.file1 ? (
                        <div
                          {...getRootProps1()}
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
                          <input {...getInputProps1()} />
                        </div>
                      ) : (
                        <div className="mt-4">
                          <img src={filePreview?.preview1} alt="preview" />
                        </div>
                      )}
                    </div>
                  )}
                  {filePreview?.file1 && (
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
                        <p>
                          {filePreview?.file1.name.length < 17
                            ? filePreview?.file1.name
                            : filePreview?.file1.name.substring(0, 17) + "..."}
                        </p>
                      </div>
                      <Image
                        onClick={() => handleDelete(1)}
                        src="/trash.svg"
                        width={200}
                        quality={100}
                        height={200}
                        className="w-4 h-4 sm:w-4 sm:h-4 invert-[0.2]"
                        alt="logo"
                      />
                    </div>
                  )}
                  <div className="flex items-center mt-8 mb-4 justify-between">
                    <h2 className="md:text-[1em] text-[0.8em]">
                      รูปหลังทำงาน(ถ่ายห่างกันอย่างน้อย 10 นาที)
                    </h2>
                    <svg
                      onClick={() => setShowimgAfter(!showimgAfter)}
                      className={`shrink-0 size-3.0 ${
                        showimgAfter ? "text-blue-500" : ""
                      }`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showimgAfter ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </>
                      )}
                    </svg>
                  </div>

                  {showimgAfter && (
                    <div>
                      {!filePreview?.file2 ? (
                        <div
                          {...getRootProps2()}
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
                          <input {...getInputProps2()} />
                        </div>
                      ) : (
                        <div className="mt-4">
                          <img
                            src={filePreview?.preview2 || ""}
                            alt="preview"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {filePreview?.preview2 && (
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
                        <p>
                          {filePreview?.file2?.name.length ?? 0 < 17
                            ? filePreview?.file2?.name
                            : filePreview?.file2?.name.substring(0, 17) + "..."}
                        </p>
                      </div>
                      <Image
                        onClick={() => handleDelete(2)}
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
                    disabled={!filePreview?.file1 || !filePreview?.file2}
                    style={{
                      backgroundColor: !(
                        !filePreview?.file1 || !filePreview?.file2
                      )
                        ? "black"
                        : "#858585",
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
                  <div className="flex grow max-w-[120px] items-center gap-x-2">
                    <h2 className="text-[1em] text-center  ">
                      {isCopy? "คัดลอกแล้ว" : `${user?.id.substring(0, 8)} ...`}
                    </h2>
                    <Image
                    onClick={()=>handleCopy()}
                      src={`/coppy${isCopy? "1":""}.svg`}
                      width={100}
                      quality={100}
                      height={100}
                      className="w-4"
                      alt="logo"
                    />
                  </div>
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
              หากยังไม่ได้ให้เข้าไปที่การตั้งค่า จากนั้นไปที่ chorm <br />
              เข้าไปที่ location ตามรูปภาพ
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
            <p className="mt-4">2.เปลี่ยนเป็นขณะใช้งานเว็บไซต์</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
