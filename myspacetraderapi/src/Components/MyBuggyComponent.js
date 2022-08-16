

export default function MyBuggyComponent(props) {
    throw new Error('I crashed!');
    return(
        <div>
            
        </div>
    )
}