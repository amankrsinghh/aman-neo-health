import { faCalendar, faHome, faUser, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData } from "../../Services/api"
import { useParams } from "react-router-dom"
import { set } from "date-fns"

function BlogDetails() {
    const { id } = useParams()
    const [baseUrl,setBaseUrl]=useState('')
    const [blogData, setBlogData] = useState('')
    async function fetchBlog() {

        const result = await getApiData(`api/admin/blogs/${id}`)
        if (result.success) {
            setBaseUrl(result.baseUrl)
            setBlogData(result.data)
        }
    }
    useEffect(() => {
        fetchBlog()
    }, [])
    return (
        <>
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Blog Details</h4>
                            </div>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                <FontAwesomeIcon icon={faHome} />
                                            </a>
                                        </li>

                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Blog Details
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="blog-detail-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog-details-content">
                                <div className="blog-details-picture">
                                    <img src={blogData?.image ? `${baseUrl}${blogData.image}` : "/blog-detail-pic.jpg"} alt="" />
                                </div>

                                <div className="bloging-details-content mt-4">
                                    <div className="d-flex gap-3 my-3">
                                        <span className="blog-user-title"><FontAwesomeIcon icon={faUser} /> Admin</span>
                                        <span className="blog-user-title"><FontAwesomeIcon icon={faCalendar} />
                                            {blogData?.createdAt &&
                                                new Date(blogData?.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                            }</span>
                                    </div>

                                    <h4 className="heading-grad mb-3">{blogData?.title}</h4>

                                    <p className="blog-detail-para">
                                        <div
                                            className="about-para"
                                            dangerouslySetInnerHTML={{ __html: blogData?.content }}
                                        />
                                    </p>
                                    {/* <p className="blog-detail-para">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    <p className="blog-detail-para">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}


                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default BlogDetails