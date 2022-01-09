
// DATA TYPE
export type TodoModel = {
    id: number;
    title: string;
    priority: string; // A: important ... D: extra (absolutely not important)
};


// UTILITY FUNCTIONS 

// Sort function
export const compareTodo = (a: TodoModel, b: TodoModel) => {

  if (a.priority < b.priority)
    return -1;

  if (a.priority == b.priority) {
    
    if (a.id < b.id)
      return -1;

    if (a.id == b.id)
      return 0;

    if (a.id > b.id)
      return 1;
  }

  if (a.priority > b.priority)
    return 1;

  return 0;
}

export const getMinPriority = (): string => {

    return 'D';
}

export const getMaxPriority = (): string => {

    return 'A';
}

export const getPriorities = (): string[] => {

    return ['A', 'B', 'C', 'D'];
}