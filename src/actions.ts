import {table, ClassTable, ProjectDescription} from "./db";

export enum EDBStatus {
    Unknown,
    Created,
    DoesNotExist,
}

// action types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_DB_STATUS = 'UPDATE_DB_STATUS';
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const UPDATE_ITERATIONS = 'UPDATE_ITERATIONS';
export const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT';
export const UPDATE_CURRENT_ITERATION = 'UPDATE_CURRENT_ITERATION';
export const UPDATE_SPI_DATA = 'UPDATE_SPI_DATA';
export const UPDATE_STUDENTS = 'UPDATE_STUDENTS';

export interface StudentProjectIteration {
    name1: string;
    name2: string;
    name3: string;
    count1: number;
    count2: number;
    count3: number;
}

export function DefaultStudentProjectIteration(): StudentProjectIteration {
    return {
        name1: 'none',
        name2: 'none',
        name3: 'none',
        count1: 0,
        count2: 0,
        count3: 0
    }
}

export interface SPIData {
    [wustlKey: string]: {
        [projectName: string]: StudentProjectIteration[]
    };
}

export interface Student {
    wustlKey: string;
    id: string;
    secret: string;
}

export interface RootState {
    loggedIn: boolean;
    dbStatus: EDBStatus;
    projects: ProjectDescription[];
    iterations: number;
    currentProject: ProjectDescription;
    currentIteration: number;
    spiData: null | SPIData;
    students: Student[];
}

export const login = () => {
    return {
        type: LOGIN,
        loggedIn: true
    };
}

export const logout = () => {
    return {
        type: LOGOUT,
        loggedIn: false
    };
}

export const updateDBStatus = (dbStatus: EDBStatus) => {
    return {
        type: UPDATE_DB_STATUS,
        dbStatus
    };
}

export const updateProjects = (projects: ProjectDescription[]) => {
    const sortedProjects = projects.sort((a, b) => a.Name < b.Name ? -1 : 1);
    return {
        type: UPDATE_PROJECTS,
        projects: sortedProjects,
        currentProject: sortedProjects[0] ? sortedProjects[0] : ProjectDescription.Create('No Projects Yet', [])
    }
}

export const updateIterations = (iterations: number) => {
    return {
        type: UPDATE_ITERATIONS,
        iterations,
        iteration: 0
    }
}

export const updateCurrentProject = (currentProject: ProjectDescription) => {
    return {
        type: UPDATE_CURRENT_PROJECT,
        currentProject
    };
}

export const updateCurrentIteration = (currentIteration: number) => {
    return {
        type: UPDATE_CURRENT_ITERATION,
        currentIteration
    };
}

export const updateSPIData = (spiData: SPIData) => {
    return {
        type: UPDATE_SPI_DATA,
        spiData
    }
}

export const updateStudents = (students: Student[]) => {
    return {
        type: UPDATE_STUDENTS,
        students
    }
}

export const fetchProjects = () => {
    return async (dispatch: any) => {
        try {
            const projects = (await (table as ClassTable).getProjectNames());
            console.log(projects)
            dispatch(updateProjects(projects));
        } catch (e) {console.log(e);}
    }
}

export const fetchSPIData = () => {
    return async (dispatch: any) => {
        try {
            dispatch(updateSPIData({}));
        } catch (e) {console.log(e);}
    }
}
