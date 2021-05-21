const Toast = (type, notify) => {
    const unquie = new Date().getTime();
    const toast = document.createElement("div");
    toast.id = unquie;
    toast.className = "toast";
    const toastBody = document.createElement("div");
    toastBody.className = "toast-body";
    const alert = document.createElement("div");
    if(type === 'error') {
    	alert.className = "alert alert-danger";
    } else {
    	alert.className = "alert alert-success";
    }
    alert.innerText = notify;
    toast.appendChild(toastBody);
    toastBody.appendChild(alert);
    document.getElementById('toast-box').appendChild(toast);
    window.$('#'+unquie).toast({delay: 2000});
    window.$('#'+unquie).toast('show');
    window.$('#'+unquie).on('hidden.bs.toast', function () {
    	window.$('#'+unquie).remove();
    })
}

export default Toast;