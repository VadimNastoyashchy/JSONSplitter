/* eslint-disable space-before-function-paren */
window.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area')

  // Prevent default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight/Area change on DragOver / DragLeave
  ;['dragenter', 'dragover'].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  ;['dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  // Handle dropped files
  dropArea.addEventListener('drop', handleDrop, false)

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files

    console.log(files)

    Array.from(files).forEach((file) => {
      console.log('File Path:', file.path)
    })
  }

  function highlight(e) {
    // Add some style to highlight
    dropArea.style.background = '#ddd'
  }

  function unhighlight(e) {
    // Remove highlighted style
    dropArea.style.background = 'none'
  }
})
