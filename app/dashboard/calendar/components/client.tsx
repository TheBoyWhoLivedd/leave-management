"use client";
import { useEffect, useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Leave {
  _id: string;
  Employee: string;
  LeaveType: string;
  LeaveDetails: string;
  StartLeaveDate: string;
  EndLeaveDate: string;
  NumOfDays: number;
  AdminRemark: string;
  AdminStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Style {
  backgroundColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderBottomLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
}

interface EmployeeData {
  name: string;
  leaves: Leave[];
}

interface CalendarNavigationProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  loading: boolean;
}

function CalendarNavigation({
  currentDate,
  setCurrentDate,
  loading,
}: CalendarNavigationProps) {
  const goToNextMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <Button disabled={loading} variant="outline" onClick={goToPreviousMonth}>
        Previous
      </Button>
      <span>
        {currentDate.toLocaleString("default", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </span>
      <Button disabled={loading} variant="outline" onClick={goToNextMonth}>
        Next
      </Button>
    </div>
  );
}
type DailyStatus = { [key: number]: string };

function getDailyStatusForEmployee(
  leaves: Leave[],
  month: number,
  year: number
): DailyStatus {
  const endDate = new Date(year, month, 0);
  const dailyStatus: DailyStatus = {};

  for (let day = 1; day <= endDate.getDate(); day++) {
    dailyStatus[day] = "No Leave";
  }

  leaves.forEach((leave) => {
    const startDay = new Date(leave.StartLeaveDate).getDate();
    const startMonth = new Date(leave.StartLeaveDate).getMonth() + 1;
    const endDay = new Date(leave.EndLeaveDate).getDate();
    const endMonth = new Date(leave.EndLeaveDate).getMonth() + 1;

    let loopStartDay = month === startMonth ? startDay : 1;
    let loopEndDay = month === endMonth ? endDay : endDate.getDate();

    for (let day = loopStartDay; day <= loopEndDay; day++) {
      dailyStatus[day] = leave.AdminStatus;
    }
  });

  return dailyStatus;
}

function getDayOfWeek(date: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

const getStatusStyles = (
  status: string,
  isFirst: boolean,
  isLast: boolean
): Style => {
  let styles: Style = {};
  switch (status) {
    case "Pending":
      styles.backgroundColor = "gray";
      break;
    case "Rejected":
      styles.backgroundColor = "#7F1D1D";
      break;
    case "Accepted":
      styles.backgroundColor = "#22C55E";
      break;
    default:
      break;
  }
  if (isFirst && isLast) {
    styles.borderRadius = "50%";
  } else if (isFirst) {
    styles.borderTopLeftRadius = "10px";
    styles.borderBottomLeftRadius = "10px";
  } else if (isLast) {
    styles.borderTopRightRadius = "10px";
    styles.borderBottomRightRadius = "10px";
  }
  return styles;
};
interface ProcessedEmployeeData extends EmployeeData {
  dailyStatus: DailyStatus;
}
export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [leaveData, setLeaveData] = useState<ProcessedEmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch data from the API using the currentDate
    fetch(
      `/api/calendar?month=${
        currentDate.getMonth() + 1
      }&year=${currentDate.getFullYear()}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Process the fetched data to get dailyStatus for each employee
        const processedData = data.map(
          (employee: EmployeeData): ProcessedEmployeeData => {
            const dailyStatus = getDailyStatusForEmployee(
              employee.leaves,
              currentDate.getMonth() + 1,
              currentDate.getFullYear()
            );
            return {
              ...employee,
              dailyStatus,
            };
          }
        );
        setLeaveData(processedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [currentDate]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  return (
    <div className="flex flex-col items-center gap-4">
      <CalendarNavigation
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        loading={isLoading}
      />
      <div>
        {["Pending", "Rejected", "Accepted"].map((status, index) => (
          <Badge
            className="mr-2"
            key={index}
            variant={
              status === "Accepted"
                ? "accepted"
                : status === "Rejected"
                ? "destructive"
                : "default"
            }
          >
            {status}
          </Badge>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              style={{ textAlign: "center" }}
              colSpan={daysInMonth + 1}
            >
              {currentDate.toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead></TableHead>
            {[...Array(daysInMonth)].map((_, idx) => (
              <TableHead key={idx}>
                {getDayOfWeek(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    idx + 1
                  )
                )}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableHead></TableHead>
            {[...Array(daysInMonth)].map((_, idx) => (
              <TableHead key={idx}>{idx + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [...Array(10)].map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  {[...Array(daysInMonth)].map((_, cellIdx) => (
                    <TableCell key={cellIdx} className="p-0">
                      <Skeleton className="h-4 w-full rounded-none" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : leaveData.map((employee) => (
                <TableRow key={employee.name}>
                  <TableCell>{employee.name}</TableCell>
                  {[...Array(daysInMonth)].map((_, idx) => {
                    const status = employee.dailyStatus[idx + 1];
                    const prevStatus = employee.dailyStatus[idx];
                    const nextStatus = employee.dailyStatus[idx + 2];
                    const isFirst = status !== prevStatus;
                    const isLast = status !== nextStatus;
                    return (
                      <TableCell
                        key={idx}
                        style={getStatusStyles(status, isFirst, isLast)}
                      ></TableCell>
                    );
                  })}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
