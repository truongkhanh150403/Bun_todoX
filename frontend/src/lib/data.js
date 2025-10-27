export const FilterType = {
    all: "tất cả",
    active: "đang làm",
    completed: "hoàn thành",
}

export const options = [
    {
        value: "today",
        label: "Hôm nay",
    },
    {
        value: "week",
        label: "Tuần này",
    },
    {
        value: "month",
        label: "Thàng này",
    },
    {
        value: "all",
        label: "Tất cả",
    },
];

export const visibleTaskLimit = 3; //visibleTaskLimit = 4 thì có 4 task mỗi trang