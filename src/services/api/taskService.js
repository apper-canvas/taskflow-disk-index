import tasksMockData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksMockData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(250);
    
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: this.tasks.length
    };

    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await delay(200);
    
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData
    };

    return { ...this.tasks[taskIndex] };
  }

  async delete(id) {
    await delay(200);
    
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await delay(250);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async getByStatus(completed) {
    await delay(250);
    return this.tasks.filter(t => t.completed === completed).map(t => ({ ...t }));
  }

  async updateOrder(taskIds) {
    await delay(300);
    
    taskIds.forEach((id, index) => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.order = index;
      }
    });

    this.tasks.sort((a, b) => a.order - b.order);
    return [...this.tasks];
  }
}

export default new TaskService();