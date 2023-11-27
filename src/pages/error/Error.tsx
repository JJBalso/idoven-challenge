import { Link } from "react-router-dom";

function Error() {
    return (
      <div className="Error">
        Ops, page not found!

        <Link to={'/'}>Go back</Link>
      </div>
    );
  }
  
  export default Error;