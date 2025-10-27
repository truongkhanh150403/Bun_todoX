import React, { useState } from 'react'
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import api from '@/lib/axios';
import { toast } from 'sonner';

const TaskCards = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    // Xử lý xóa nhiệm vụ
    try {
      await api.delete(`/tasks/${taskId}`)
      toast.success('Nhiệm vụ đã được xóa.');
      handleTaskChanged();
    } catch (error) {
      console.error('Lỗi khi xoá nhiệm vụ.', error);
      toast.error('Xóa nhiệm vụ thất bại.');      
    }    
  }

  const updateTask = async () => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`,{
        title: updateTaskTitle
      })
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`);
      handleTaskChanged();  
    } catch (error) {
      console.error('Lỗi khi update task.', error);
      toast.error('Lỗi xảy ra khi cập nhật nhiệm vụ.');
    }
  }

  const toggleTaskCompletedButton = async () => {
    try {
      if(task.status === 'active'){
        await api.put(`/tasks/${task._id}`,{
          status: 'completed',
          completedAt: new Date().toISOString(),
        })

        toast.success(`${task.title} đã hoàn thành.`)
      }else {
        await api.put(`/tasks/${task._id}`,{
          status: 'active',
          completedAt: null,
        })

        toast.warning(`${task.title} đã được chuyển sang trạng thái chưa hoàn thành.`)
      }

      handleTaskChanged();
    } catch (error) {
      console.error('Lỗi khi update status task.', error);
      toast.error('Lỗi xảy ra khi cập nhật trạng thái nhiệm vụ.');
    }
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      updateTask();
    }   
  }

  return (
    <Card className={cn(
      "p-4 bg-gradient-card border-0 shadow-custom-md hover: shadow-custom-lg transition-all duration-200 animate-fate-in group",
      task.status === 'completed' && 'opacity-75'
    )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className ='flex items-center gap-4'>
        {/*Nút tròn */}
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === 'completed'
              ? 'text=success hover:text-sucess/80'
              : 'text-muted-forefround hover:text-primary'
          )}
          onClick={toggleTaskCompletedButton}
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className='size-5' />
          ) : (
            <Circle className='size-5' />
          )}
        </Button>

        {/*Hiển thị hoặc chỉnh sửa tiêu đề́*/}
        <div className='flex-1 min-w-0'>
          {isEditting ? (

            <Input
              placeholder='Cần phải làm gì?'
              className='flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20'
              type="text"
              value = {updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur = {() => {
                setIsEditting(false);
                setUpdateTaskTitle(task.title || "");
              }}
            />

          ) : (
            <p className={cn(
              "text-base transition-all duration-200",
              task.status === 'completed'
                ? "line -through text-muted-foreground"
                : "text-foregorund"
            )}>
              {task.title}
            </p>
          )}

          {/*Ngày tạo & ngày hoàn thành*/}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString('vi-VN', {
                //timeZone: 'Asia/Taipei',
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString('vi-VN', {
                    //timeZone: 'Asia/Taipei',
                    timeZone: 'Asia/Ho_Chi_Minh',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </>
            )}

          </div>
        </div>



        {/*Nút chỉnh và nút xóa*/}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up" >
          {/* Nút chỉnh sửa */}
          <Button
            variant="ghost"
            size='icon'
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick = {() => {
              setIsEditting(true);
              setUpdateTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Nút xóa */}
          <Button
            variant="ghost"
            size='icon'
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>

        </div>

      </div>

    </Card>
  )
}

export default TaskCards
