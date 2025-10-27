
import AddTasks from '@/components/AddTasks';
import DateTimeFilters from '@/components/DateTimeFilters';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StatsAndFilters from '@/components/StatsAndFilters';
import TaskList from '@/components/TaskList';
import TaskListPagination from '@/components/TaskListPagination';
import React, { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { visibleTaskLimit } from '@/lib/data';

const HomePage = () => {
  const [taskBuffer, settaskBuffer] = useState([]);
  const [activeTaskCount, setActiveCount] = useState(0);
  const [completedTaskCount, setCompletedCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState('today');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery])

  useEffect(() => {
    setPage(1);
  },[filter, dateQuery])

  //logic
  const fetchTasks = async () => {
     try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      settaskBuffer(res.data.tasks);
      setActiveCount(res.data.activeCount);
      setCompletedCount(res.data.completedCount);

     } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất nhiệm vụ (tasks:)", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks.");
     }
  }

  const handleTaskChanged = () => {
    fetchTasks();
  }

  const handleNext = () => {
    if(page < totalPages) {
      setPage((prev) => prev +1);
    }
  }

  const handlePrev = () => {
    if(page > 1) {
      setPage((prev) => prev -1);
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  }

  // biến
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case 'active':
        return task.status === 'active';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  })

  const visibleTasks = filteredTasks.slice(   //slice để cắt mảng từ vt bắt đầu đến trước vt kết thúc
    (page - 1) * visibleTaskLimit,      //bắt đầu từ task đầu tiên của trang
    page * visibleTaskLimit             //kết thúc ở task cuối cùng của trang 
  );

  if(visibleTasks.length === 0 && page > 1){
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit); //ceil làm tròn lên


  return (
  <div className="min-h-screen w-full bg-[#020617] relative">
      {/* Dark Sphere Grid Background */}
    <div
      className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
    }}
      />
      {/* Your Content/Components */}

    <div className = 'container pt-8 mx-auto relative z-10'>
      <div className = 'w-full max-w-2xl p-6 mx-auto space-y-6'>

        {/* Đầu Trang */}
        <Header/>

        {/* Tạo Nhiệm Vụ */}
        <AddTasks handleNewTaskAdded={handleTaskChanged} />

        {/* Thống Kê Và Bộ Lọc */}
        <StatsAndFilters
          filter = {filter}
          setFilter = {setFilter} 
          activeTaskCount={activeTaskCount}
          completedTaskCount={completedTaskCount}
        />

        {/* Danh Sách Nhiệm Vụ */}
        <TaskList 
          filteredTasks={visibleTasks} 
          filter={filter}
          handleTaskChanged={handleTaskChanged}
        />
        
        {/* Phân Trang Và Lọc Theo Date */}
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <TaskListPagination
            handleNext={handleNext}
            handlePrev={handlePrev}
            handlePageChange={handlePageChange}
            page={page}
            totalPages={totalPages}


          />
          <DateTimeFilters dateQuery={dateQuery} setDateQuery={setDateQuery}/>
        </div>

        {/* Chân Trang */}
        <Footer
          activeTaskCount = {activeTaskCount}
          completedTaskCount ={completedTaskCount}
        /> 

       

      </div>
    </div>
</div>

    
  )
}

export default HomePage;
